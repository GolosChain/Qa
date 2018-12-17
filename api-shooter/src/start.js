const wrapper        = require("./wrapper");
const logger         = require("./logger");
const config         = require("../config.json");
const fs             = require('fs');
const golos          = require('golos-js');
const golos_helper   = require('./golos_helper');
const prefiller   = require('./prefiller');

golos.config.set('websocket', "ws://0.0.0.0:8091");
golos.config.set('address_prefix', "GLS");
golos.config.set('chain_id', "5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679");

const runAPIunit = async () => {
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

    await wrapper.waitConditionChange(async ()=> {
      let hf = await golos.api.getHardforkVersionAsync();
      return parseInt(hf.split('.')[1]) == 19;
    });

    await wrapper.delay(10 * 60 * 1000);
    await wrapper.delay(6 * 1000);
    await prefiller.longterm();
    await wrapper.delay(5 * 60 * 1000);
    await prefiller.shortterm();

    await wrapper.delay(3 * 60 * 1000);
    process.exit();
  }
  catch(err) {
    logger.elog("Running docker container " + config.defaultBuildName + " failed.", err.message);
  }
};

runAPIunit();