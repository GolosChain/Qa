const fs = require('fs');
const logger = require('@logger');
const config = require('@config');
const fs_helper = require('@fs_helper');
const cp = require('child_process');
const path = require('path');

const runDockerContainer = async () => {
  try {
    logger.oklog("Running docker container");

    let dockerCommand = "sudo docker run -d --name " + config.containerName + " \
                        -p 8090:8090 \
                        -p 8091:8091 \
                        -p 2001:2001 \
                        -v " + config.volumeDataDir + ":/var/lib/golosd \
                        -e STEEMD_EXTRA_OPTS=--replay-blockchain \
                        -v " + config.configDir.toString() + ":/etc/golosd \
                        " + config.image;

    let hash = '';
    let cmd = cp.exec(dockerCommand, {detached: false});

    cmd.stdout.on('data', function (data) {
      hash = data.toString('utf8').replace('\n',  "");
      logger.oklog('Docker container hash', hash);
    });

    cmd.stderr.on('data', function (data) {
      logger.elog(data.toString('utf8'));
    });

    await fs_helper.waitConditionChange( async ()=> {
      return hash.length > 0;
    }, 500);

    return hash;
  }
  catch(err) {
    logger.elog("Running docker container failed", err.message);
  }
};

const stopDockerContainer = async (hash) => {
  try {
    logger.oklog("Stopping docker container");
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

    await fs_helper.waitConditionChange( async ()=> {
        return resultHash.length > 0;
    }, 500);
  }
  catch(err) {
    logger.elog("Stopping docker container failed.", err.message);
  }    
};

const rmDockerContainer = async (hash) => {
  try {
    logger.oklog("Removing docker container");
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

    await fs_helper.waitConditionChange( async ()=> {
        return resultHash.length > 0;
    }, 500);
  }
  catch(err) {
    logger.elog("Removing docker container failed.", err.message);
  }
};

const cleanWitnessNodeDataDir = async () => {
  try {
    await logger.oklog("Cleaning blockchain data dir");
    let dockerCommand = "rm -r " + config.volumeDataDir + "/blockchain/ \
      " + config.volumeDataDir + "/logs/ \
      " + config.volumeDataDir + "/p2p/";

    let done = false;
    let cmd = cp.exec(dockerCommand, {detached: false});

    cmd.stderr.on('data', function (data) {
      logger.elog(data.toString('utf8'));
    });

    cmd.on('close', () => {
      done = true;
    });

    await fs_helper.waitConditionChange( async ()=> {
        return done;
    }, 100);
  }
  catch(err) {
    logger.elog("Removing docker container failed.", err.message);
  }
};

const setDefaultConfig = async () => {
  try {
    await logger.oklog("Changing config.ini file");

    let defaultConfigPath = path.resolve(defaultConfigPath, './config.ini');

    let dockerConfigPath = path.resolve(configDir, './config.ini');

    fs.writeFileSync(dockerConfigPath, configData);
    logger.log('Config file was changed', {} );

    await fs_helper.waitConditionChange( async ()=> {
        return done;
    }, 100);
  }
  catch(err) {
    logger.elog('Can not write to config file', { "error": err.message});
  }
};

const setConfig = async (configData) => {
  try {
    await logger.oklog("Changing config.ini file");
    // let configPath = path.resolve(config.volumeDataDir, './config.ini');
    let configPath = path.resolve(config.configDir, './config.ini');
    await fs.writeFileSync(configPath, configData);
    logger.oklog('Config file was changed', {} );
  }
  catch(err) {
    logger.elog('Can not write to config file', { "error": err.message});
  }
};

const setBlockLog = async () => {
  try {
    await logger.oklog("Adding block log");
    let dockerCommand = 'cp -r ' + config.blocklogPath + ' ' + config.volumeDataDir;

    let done = false;
    let cmd = cp.exec(dockerCommand, {detached: false});

    cmd.stderr.on('data', function (data) {
      logger.elog(data.toString('utf8'));
    });

    cmd.on('close', () => {
      done = true;
    });

    await fs_helper.waitConditionChange( async ()=> {
        return done;
    }, 100);
  }
  catch(err) {
    logger.elog("Adding block log failed.", err.message);
  }
};

// Executes cli_wallet commands sequently one by one
const runCliWalletScript = async (commands) => {
  try {

    let command = "sudo docker exec -i " + config.containerName + "\
        /usr/local/bin/cli_wallet --server-rpc-endpoint=\"ws://127.0.0.1:8091\" \
        --commands=\"" + commands + "\""

    let done = false;
    let cmd = cp.exec(command, {detached: false});

    cmd.stdout.on('data', function (data) {
      logger.log(data.toString('utf8'));
    });

    cmd.stderr.on('data', function (data) {
      logger.log(data.toString('utf8'));
    });

    cmd.on('close', () => {
      done = true;
    });

    await fs_helper.waitConditionChange( async ()=> {
        return done;
    }, 100);

  }
  catch(err) {
    logger.elog("Executing cli_wallet script failed with error", err.message);
  }
};


module.exports.runDockerContainer         =     runDockerContainer;
module.exports.stopDockerContainer        =     stopDockerContainer;
module.exports.rmDockerContainer          =     rmDockerContainer;
module.exports.cleanWitnessNodeDataDir    =     cleanWitnessNodeDataDir;
module.exports.setConfig                  =     setConfig;
module.exports.setDefaultConfig           =     setDefaultConfig;
module.exports.setBlockLog                =     setBlockLog;
module.exports.runCliWalletScript         =     runCliWalletScript;
