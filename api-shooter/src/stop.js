const wrapper =   require("./wrapper");
const logger  =   require("./logger");
const config  =   require("../config.json");
const fs      =   require('fs');
const path    =   require('path');
const util = require('util');



const readFile = util.promisify(fs.readFile);
const getHash = async () => {
  return await readFile('container_hash');
}

const run = async (args) => {
  try {
    let ready = false;

    let containerHash;

    fs.readFile("container_hash", {encoding: 'utf-8'}, function(err, res) {
      if (err) {
        throw err;
      }
      containerHash = res;
      ready = true;
    });

    await wrapper.waitConditionChange( async () => {
      return ready == true;
    });

    await wrapper.stopDockerContainer(containerHash);
    await wrapper.rmDockerContainer(containerHash); 

    await fs.unlinkSync('./container_hash');
  }
  catch(err) {
    logger.elog("Stopping docker container" + config.defaultBuildName + " failed.", err.message);
  }
};

run();
