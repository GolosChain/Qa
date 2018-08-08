const path = require('path');
const moduleAlias = require('module-alias');

const rootDir = process.cwd();
moduleAlias.addAlias('@root',           rootDir                                 );
moduleAlias.addAlias('@fs_helper',      rootDir + '/helpers/fs_helper.js'       );
moduleAlias.addAlias('@docker_helper',  rootDir + '/helpers/docker_helper.js'   );
moduleAlias.addAlias('@golos_helper',   rootDir + '/helpers/golos_helper.js'    );
moduleAlias.addAlias('@tests_runner',   rootDir + '/helpers/tests_runner.js'    );
moduleAlias.addAlias('@logger',         rootDir + '/helpers/logger.js'          );
moduleAlias.addAlias('@config',         rootDir + '/config.json'                );

const config         =  require("@config");
const runner         =  require('@tests_runner');
const fs_helper      =  require('@fs_helper');
const docker_helper  =  require('@docker_helper');

const run = async () => {
  await runner.runTests("api_tests", rootDir);
  await runner.runTests("config_tests", rootDir);

  await process.exit(0);
};

run();
