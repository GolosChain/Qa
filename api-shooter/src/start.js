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

const run = async () => {
  try {
    await wrapper.cleanWitnessNodeDataDir(config.defaultBuildName);
    await wrapper.setBlockLog(config.defaultBuildName);
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

    await wrapper.delay(6000);

    await wrapper.waitConditionChange(async ()=> {
      let hf = await golos.api.getHardforkVersionAsync();
      return parseInt(hf.split('.')[1]) == 19;
    });

    await fill_825();

    process.exit();
  }
  catch(err) {
    logger.elog("Running docker container " + config.defaultBuildName + " failed.", err.message);
  }
};

run();