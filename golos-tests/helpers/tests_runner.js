const config         =   require('@config')
const logger         =   require('@logger')
const fs             =   require('fs');
const docker_helper  =   require('@docker_helper');


const getFileName = (str) => {
    return str.split('/').slice(-1)[0]
};

const cutExtention = (str) => {
    return str.split('.')[0]
};

const getFolderName = (path) => {
    return path.split('/').slice(-2)[0];
};

var walkSync = function(dir, filelist, result) {
    var path = path || require('path');
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);

    filelist = filelist || [];
    files.forEach(function(file) {
        let pwd = path.join(dir, file);
        if (/t\d+/.test(file)) {
            filelist = [];
        }
        if (fs.statSync(pwd).isDirectory()) {

            filelist = (walkSync(pwd, filelist,  result));

            if (/t\d+/.test(file)) {
                result[file] = {"path" : pwd, "files" : filelist};                
            }
        }
        else {
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
};

async function runTests(testsFolder, rootDir) {
    let testsDir = rootDir + '/' + testsFolder;
    let testsList = {};
    let testsStatistics = {};

    walkSync(testsDir, null, testsList);

    let keys = Object.keys(config[testsFolder]);
    let len = keys.length;

    for (let i = 0; i < len; i++) {
        testsList[keys[i]].cases = config[testsFolder][keys[i]]["cases"];
    }

    await logger.oklog("Running " + testsFolder +"...");

    let containerHash = '';

    keys = Object.keys(testsList);

    for (let t = 0, len = keys.length; t < len; t++) {
        let test = testsList[keys[t]];

        // Object which would contain the testcases. Imports from cases.js files.
        let Cases = {};
        // Optionaly contains config.ini files for hypervisior tests which need changing config manualy
        let configs = {};
        // Contains names of methods which would be run
        let casesToRun = [];
        // Path to require Cases object
        let casesPath = '';

        // Searching for testcases -- cases.js and config.ini files.
        // Saving them
        for (let j = 0; j < test.files.length; ++j) {
            let path = test.files[j];
            let name = getFileName(path);

            if (name == 'cases.js') {
                Cases = await require(path).Cases;
                casesPath = path;
            }
            else if (/config(\s*|\d+)+.ini/.test(name)) {
                try {
                    let current_config = await fs.readFileSync(path);
                    
                    let splitRes = name.split(".");
                    let idx =  splitRes[0].indexOf('g');
                    let keyName = 'case' + splitRes[0].substr(idx + 1, splitRes[0].length);
                    if (keyName == 'case') {
                        keyName += '1'; 
                    }
                    configs[keyName] = await current_config.toString('utf8');
                }
                catch(err) {
                    logger.elog("Failed reading file", {"err": err.message, "path" : path});
                }
            }
        }
// There are three possible value for 'cases' field in config.json file:
// 1. 'all' -- means that ALL the testscases from cases.js will be run
// 2. 'null' -- means that this test will be ignored
// 3. ['caseN', ... , 'caseM'] -- means that only tests listed in array will be run
        let casesCfg = test.cases;

        if (casesCfg == 'all') {
            let tmp_str = 'case';
            Cases = require(casesPath).Cases;
            let casesCount = Object.keys(Cases).length;

            for (let x = 1; x <= casesCount; ++x) {
                let s = tmp_str + x.toString();
                casesToRun.push(tmp_str + x)
            }

        }
        else if (casesCfg == null) {
            casesToRun = [];
        }
        else {
            casesToRun = config[testsFolder][getFolderName(casesPath)]['cases'];
        }

        let issueName = getFolderName(casesPath);

// RUNNNING TESTS
        if (casesToRun.length == 0) {
            await logger.oklog('Ignoring tests for ' + issueName + '.', {'cases': casesToRun} );
        }
        else {
            // If tests do not need hypervising thet golosd must be executed outside of tests
            if (testsFolder == 'api_tests') {
                await docker_helper.cleanWitnessNodeDataDir();
                await docker_helper.setBlockLog();
                containerHash = await docker_helper.runDockerContainer();
            }

            testsStatistics[issueName] = [];
            await logger.oklog('Running tests for ' + issueName + '. Following tests will be executed:', {'cases': casesToRun} );
            for (let i = 0, len = casesToRun.length; i < len; i++) {
                let isSuccessfull = await Cases[casesToRun[i]](configs[casesToRun[i]]);
                testsStatistics[issueName].push(isSuccessfull);
            }

            // If tests do not need hypervising thet golosd must be also stoped outside of tests
            if (testsFolder == 'api_tests') {
                await docker_helper.stopDockerContainer(containerHash);
                await docker_helper.rmDockerContainer(containerHash); 
            }
            await logger.oklog('Done with ' + issueName + ' tests.');
        }

    }

    // Print the statistics
    let statKeys = Object.keys(testsStatistics);
    for (let i = 0, len = statKeys.length; i < len; i++) {
        let results = testsStatistics[statKeys[i]];
        let statObj = {};
        for (let j = 0, sz = results.length; j < sz; j++) {
            statObj['case' + (j + 1)] = results[j];
        }
        logger.log(testsFolder, {
            'issue': statKeys[i],
            'statistics': statObj
        });
    }
    await logger.oklog('Done with ' + testsFolder);
};

module.exports.runTests = runTests;
