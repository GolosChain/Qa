const wrapper        = require("./wrapper");
const logger         = require("./logger");
const config         = require("../config.json");
const fs             = require('fs');

const golos          = require('golos-js');
const golos_helper   = require('./golos_helper');

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

    let cyberfounder = 'cyberfounder';
    let cyberfounderKey = config.golosdProperties.cyberfounderKey;
    let fee = '3.000 GOLOS';

    console.log('-- Creating test');
    let authorTest = 'test';
    let passwordTest = 'test';
    let wifTest = golos.auth.toWif(authorTest, passwordTest, 'posting');
    let wifTestActive = golos.auth.toWif(authorTest, passwordTest, 'active');
    let keysTest = await golos_helper.generateKeys(authorTest, passwordTest);
    await golos_helper.createAccount(authorTest, keysTest, cyberfounder, fee);
    await wrapper.delay(6000);

    console.log('-- Creating test comment');
    let permlink = 'test';
    let parentPermlink = 'ptest';
    let title = 'test title';
    let body = 'test body...';
    let jsonMetadata = '{}';
    await golos_helper.createPost('test', wifTest, permlink, parentPermlink, title, body, jsonMetadata);
    await wrapper.delay(6000);

    console.log('-- Set vesting withdraw route');
    await golos.broadcast.setWithdrawVestingRouteAsync(wifTestActive, "test", "cyberfounder", 10000, false);
    await wrapper.delay(6000);

    console.log('-- Voting for witness');
    await golos.broadcast.accountWitnessVoteAsync(wifTestActive, "test", "cyberfounder", true);
    await wrapper.delay(6000);

    console.log('-- Creating escrowagent');
    let authorEA = 'escrowagent';
    let passwordEA = 'escrowagent';
    let keysEA = await golos_helper.generateKeys(authorEA, passwordEA);
    await golos_helper.createAccount(authorEA, keysEA, cyberfounder, fee);
    await wrapper.delay(6000);

    console.log('-- Transfering escrow');
    await golos.broadcast.transferAsync(cyberfounderKey, 'cyberfounder', 'test', '10.000 GBG', '');
    await wrapper.delay(6000);
    await golos.broadcast.escrowTransferAsync(wifTestActive, 'test', 'cyberfounder', 'escrowagent', 48760203, '0.001 GBG', '0.001 GOLOS', '0.001 GOLOS',
       '2018-12-01T00:00:00', '2018-12-20T00:00:00', '{}');
    await wrapper.delay(6000);

    console.log('-- Updating account');
    let keysTestUpdate = await golos_helper.generateKeys(authorTest, passwordTest + 'update');
    let owner = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[keysTestUpdate.owner, 1]]
    };
    let active = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[keysTestUpdate.active, 1]]
    };
    let posting = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[keysTestUpdate.posting, 1]]
    };
    let memoKey = keysTestUpdate.memo;
    await golos.broadcast.accountUpdate(wifTestActive, 'test', owner, active, posting, memoKey, jsonMetadata);
    await wrapper.delay(6000);

    console.log('-- Requesting recovery');
    let newOwner = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[(await golos_helper.generateKeys(authorTest, passwordTest + 'recover')).owner, 1]]
    };
    await golos.broadcast.requestAccountRecoveryAsync(cyberfounderKey, 'cyberfounder', authorTest, newOwner, []);
    await wrapper.delay(6000);

    process.exit();
  }
  catch(err) {
    logger.elog("Running docker container " + config.defaultBuildName + " failed.", err.message);
  }
};

run();
