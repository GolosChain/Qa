const wrapper = require("./wrapper");
const logger  = require("./logger");
const config  = require("../config.json");
const fs      = require('fs');

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

  }
  catch(err) {
    logger.elog("Running docker container " + config.defaultBuildName + " failed.", err.message);
  }
};

run();
