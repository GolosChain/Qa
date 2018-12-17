const fs              =        require('fs');
const path            =        require('path');
const cp              =        require('child_process');
const logger          =        require('./logger');
const config          =        require("../config.json");



const delay = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

const waitConditionChange = async(cond, ts = 1000 * 3) => {
  while(true) {
    await delay(ts)

    let nowCondition = await cond();
    if (nowCondition == true) {
      break;
    }
  }
}

const runDockerContainer = async (buildName = config.defaultBuildName) => {
  try {
    logger.log("Running docker container " + buildName);

    let dockerCommand = "sudo docker run -d --name " + config[buildName].containerName + " \
                        -p 8090:8090 \
                        -p 8091:8091 \
                        -p 2001:2001 \
                        -v " + config[buildName].volumeDataDir + ":/var/lib/golosd \
                        -e STEEMD_EXTRA_OPTS=--replay-blockchain \
                        -v " + config[buildName].configDir + ":/etc/golosd \
                        " + config[buildName].image;

    let hash = '';
    let cmd = cp.exec(dockerCommand, {detached: false});

    cmd.stdout.on('data', function (data) {
      hash = data.toString('utf8').replace('\n',  "");
      logger.oklog('Docker container hash', hash);
    });

    cmd.stderr.on('data', function (data) {
      logger.elog(data.toString('utf8'));
    });

    await waitConditionChange( async ()=> {
      return hash.length > 0;
    }, 500);

    return hash;
  }
  catch(err) {
    logger.elog("Failed to run docker container", err.message);
  }
};

const stopDockerContainer = async (hash) => {
  try {
    logger.log("Stopping docker container");
    let dockerCommand = "sudo docker stop " + hash;


    let resultHash = '';
    let cmd = cp.exec(dockerCommand, {detached: false});

    cmd.stdout.on('data', function (data) {
      resultHash = data.toString('utf8').replace('\n',  "");
      logger.oklog('Docker was stopped.', hash);
    });

    cmd.stderr.on('data', function (data) {
      logger.elog(data.toString('utf8'));
    });

    await waitConditionChange( async ()=> {
        return resultHash.length > 0;
    }, 500);
  }
  catch(err) {
    logger.elog("Stopping docker container failed.", err.message);
  }    
};

const rmDockerContainer = async (hash) => {
  try {
    logger.log("Removing docker container");
    let dockerCommand = "sudo docker rm " + hash;

    let resultHash = '';
    let cmd = cp.exec(dockerCommand, {detached: false});

    cmd.stdout.on('data', function (data) {
      resultHash = data.toString('utf8').replace('\n',  "");
      logger.oklog('Docker was removed.', hash);
    });

    cmd.stderr.on('data', function (data) {
      logger.elog(data.toString('utf8'));
    });

    await waitConditionChange( async ()=> {
      return resultHash.length > 0;
    }, 500);
    logger.oklog('Done', {} );
  }
  catch(err) {
    logger.elog("Removing docker container failed.", err.message);
  }
};

const cleanWitnessNodeDataDir = async (buildName = config.defaultBuildName) => {
  try {
    logger.log("Cleaning blockchain data dir");
    let dockerCommand = "rm -r " +
          config[buildName].volumeDataDir + "/blockchain/ \
      " + config[buildName].volumeDataDir + "/logs/ \
      " + config[buildName].volumeDataDir + "/p2p/";

    let done = false;
    let cmd = cp.exec(dockerCommand, {detached: false});

    cmd.stderr.on('data', function (data) {
      logger.elog(data.toString('utf8'));
    });

    cmd.on('close', () => {
      done = true;
    });

    await waitConditionChange( async ()=> {
      return done;
    }, 100);

    logger.oklog('Done', {} );
  }
  catch(err) {
    logger.elog("Removing docker container failed.", err.message);
  }
};

const setConfig = async (configData, buildName = config.defaultBuildName) => {
  try {
    logger.log("Changing config.ini file");

    let configPath = path.resolve(config[buildName].configDir, './config.ini');
    await fs.writeFileSync(configPath, configData);

    logger.oklog('Done', {} );
  }
  catch(err) {
    logger.elog('Can not write to config file', { "error": err.message});
  }
};

const setBlockLog = async (buildName = config.defaultBuildName) => {
  try {
    await logger.log("Adding block log");
    let dockerCommand = 'cp -r ' + config[buildName].blocklogPath + ' ' + config[buildName].volumeDataDir;

    let done = false;
    let cmd = cp.exec(dockerCommand, {detached: false});

    cmd.stderr.on('data', function (data) {
      logger.elog(data.toString('utf8'));
    });

    cmd.on('close', () => {
      done = true;
    });

    await waitConditionChange( async ()=> {
      return done;
    }, 100);

    logger.oklog('Done', {} );
  }
  catch(err) {
    logger.elog("Adding block log failed.", err.message);
  }
};

// Executes cli_wallet commands sequently one by one
const runCliWalletScript = async (commands, buildName = config.defaultBuildName) => {
  try {
    console.log('BEGIN')
      let command = "sudo docker exec -i " + config[buildName].containerName + "\
        /usr/local/bin/cli_wallet --server-rpc-endpoint=\"ws://127.0.0.1:8091\" \
        --commands=\"" + commands + "\""

    let done = false;
    let cmd = cp.exec(command, {detached: false});

    cmd.stdout.on('data', function (data) {
      console.log(data.toString('utf8'));
    });

    cmd.stderr.on('data', function (data) {
      console.log(data.toString('utf8'));
    });

    cmd.on('close', () => {
      done = true;
    });

    await waitConditionChange( async ()=> {
        return done;
    }, 100);
    console.log('SUCCESS')
  }
  catch(err) {
    logger.elog("Executing cli_wallet script failed with error", err.message);
  }
};



module.exports.runDockerContainer         =       runDockerContainer;
module.exports.stopDockerContainer        =       stopDockerContainer;
module.exports.rmDockerContainer          =       rmDockerContainer;
module.exports.cleanWitnessNodeDataDir    =       cleanWitnessNodeDataDir;
module.exports.setConfig                  =       setConfig;
module.exports.setBlockLog                =       setBlockLog;
module.exports.waitConditionChange        =       waitConditionChange;
module.exports.delay                      =       delay;
module.exports.runCliWalletScript         =       runCliWalletScript;
