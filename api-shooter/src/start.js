const wrapper        = require("./wrapper");
const logger         = require("./logger");
const config         = require("../config.json");
const fs             = require('fs');

const golos          = require('golos-js');
const golos_helper   = require('./golos_helper');

const actors = async (...acc_names) => {
  for (let acc_name of acc_names) {
    let cyberfounder = 'cyberfounder';
    let cyberfounderKey = config.golosdProperties.cyberfounderKey;
    let fee = '3.000 GOLOS';

    console.log('---- Creating ' + acc_name + ' account');
    let acc_keys = await golos_helper.generateKeys(acc_name, acc_name);
    await golos_helper.createAccount(acc_name, acc_keys, cyberfounder, fee);
    await wrapper.delay(6000);
  }
};

const actor = async (...acc_name) => actors(acc_name);

const fill_825 = async () => {
  console.log('-- Fill for 825 issue');

  await actors('test-825-1', 'test-825-2', 'test-825-3');

  console.log('---- Creating test-825-1 post');
  let wifTest = golos.auth.toWif('test-825-1', 'test-825-1', 'posting');
  let permlink = 'test-825-1';
  let parentPermlink = 'ptest';
  await golos_helper.createPost('test-825-1', wifTest, permlink, parentPermlink, 'test title', 'test body', '{}');
  await wrapper.delay(6000);

  console.log('---- Creating test-825-2 comment');
  wifTest = golos.auth.toWif('test-825-2', 'test-825-2', 'posting');
  permlink = 'test-825-2';
  parentPermlink = 'test-825-1';
  parentAuthor = 'test-825-1';
  await golos_helper.createComment('test-825-2', wifTest, permlink, parentAuthor, parentPermlink, 'test title', 'test body', '{}');
  await wrapper.delay(6000);
};

const fill_898 = async () => {
  console.log('-- Fill for 898 issue');

  await actors('test-898');

  console.log('---- Creating test-898-author');
  let wifTest = golos.auth.toWif('test-898', 'test-898', 'posting');
  let permlink = 'test-898';
  let parentPermlink = 'ptest';
  await golos_helper.createPost('test-898', wifTest, permlink, parentPermlink, 'Test title', 'Test body', '{}');
  await wrapper.delay(6000);
};

const fill_295 = async () => {
  console.log('-- Fill for 295 issue');

  await actors('test-295-0');

  let cyberfounder = 'cyberfounder';
  let cyberfounderKey = config.golosdProperties.cyberfounderKey;
  let fee = '3.000 GOLOS';

  console.log('---- Creating test-295-refl-1 account');
  let acc_keys = await golos_helper.generateKeys('test-295-refl-1', 'test-295-refl-1');
  let end_date = new Date();
  end_date.setSeconds(end_date.getSeconds() + 10);
  let aro = {};
  aro.referrer = 'test-295-0';
  aro.interest_rate = 9*100;
  aro.end_date = end_date.toISOString().split(".")[0];
  aro.break_fee = "0.000 GOLOS";
  let extensions = [[0, aro]];
  await golos_helper.createAccountDelegated('test-295-refl-1', acc_keys, cyberfounder, fee, '0.000001 GESTS', extensions);
  await wrapper.delay(6000);

  console.log('---- Creating test-295-1 post');
  let wifTest = golos.auth.toWif('test-295-refl-1', 'test-295-refl-1', 'posting');
  let permlink = 'test-295-1';
  let parentPermlink = 'ptest';
  await golos_helper.createPost('test-295-refl-1', wifTest, permlink, parentPermlink, 'test title', 'test body', '{}');
  await wrapper.delay(6000);

  console.log('---- Creating test-295-2 post');
  wifTest = golos.auth.toWif('test-295-refl-1', 'test-295-refl-1', 'posting');
  permlink = 'test-295-2';
  parentPermlink = 'ptest';
  await golos_helper.createPost('test-295-refl-1', wifTest, permlink, parentPermlink, 'test title', 'test body', '{}');
  await wrapper.delay(6000);

  console.log('---- Creating test-295-refl-2 account');
  acc_keys = await golos_helper.generateKeys('test-295-refl-2', 'test-295-refl-2');
  end_date = new Date();
  end_date.setSeconds(end_date.getSeconds() + 1000000);
  aro.end_date = end_date.toISOString().split(".")[0];
  aro.break_fee = "0.001 GOLOS";
  extensions = [[0, aro]];
  await golos_helper.createAccountDelegated('test-295-refl-2', acc_keys, cyberfounder, fee, '0.000001 GESTS', extensions);
  await wrapper.delay(6000);

  console.log('---- Creating test-295-refl-3 account');
  acc_keys = await golos_helper.generateKeys('test-295-refl-3', 'test-295-refl-3');
  aro.break_fee = "0.000 GOLOS";
  extensions = [[0, aro]];
  await golos_helper.createAccountDelegated('test-295-refl-3', acc_keys, cyberfounder, fee, '0.000001 GESTS', extensions);
  await wrapper.delay(6000);
};

const fill_324 = async () => {
  console.log('-- Fill for 324 issue');

  await actors('t324-1');

  let cyberfounder = 'cyberfounder';
  let cyberfounderKey = config.golosdProperties.cyberfounderKey;
  let fee = '3.000 GOLOS';

  console.log('---- Creating t324-default post');
  let wifTest = golos.auth.toWif('t324-1', 't324-1', 'posting');
  let permlink = 't324-default';
  let parentPermlink = 'ptest';
  await golos_helper.createPost('t324-1', wifTest, permlink, parentPermlink, 'test title', 'test body', '{}');
  await wrapper.delay(6000);
};

const run = async () => {
  try {
    await wrapper.cleanWitnessNodeDataDir(config.defaultBuildName);
    await wrapper.setBlockLog(config.defaultBuildName);
    let configini = await fs.readFileSync(config[config.defaultBuildName].defaultConfigPath);
    await wrapper.setConfig(configini.toString('utf8'));

    containerHash = await wrapper.runDockerContainer(config.defaultBuildName);

    let ready = false;

    await fs.writeFile("./container_hash", containerHash, function(err, res) {
      if (err) {
        throw err;
      }
      ready = true;
    });

    await wrapper.waitConditionChange( async () => {
      return ready == true;
    });

    await wrapper.delay(6 * 1000);

    await wrapper.waitConditionChange(async ()=> {
      let hf = await golos.api.getHardforkVersionAsync();
      return parseInt(hf.split('.')[1]) == 19;
    });

    //await fill_825();
    //await fill_898();
    //await fill_295();
    await fill_324();

    process.exit();
  }
  catch(err) {
    logger.elog("Running docker container " + config.defaultBuildName + " failed.", err.message);
  }
};

run();