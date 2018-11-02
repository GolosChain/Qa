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
    let fee = '3.000 GOLOS';

    // Creating test

    let authorTest = 'test';
    let passwordTest = 'test';

    let wifTest = golos.auth.toWif(authorTest, passwordTest, 'posting');
    let keysTest = await golos_helper.generateKeys(authorTest, passwordTest);

    await golos_helper.createAccount(authorTest, keysTest, cyberfounder, fee);
    await wrapper.delay(6000);

    process.exit();
  }
  catch(err) {
    logger.elog("Running docker container " + config.defaultBuildName + " failed.", err.message);
  }
};

run();
