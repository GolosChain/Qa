// Test for 867 issue
// https://github.com/GolosChain/golos/issues/829
// https://github.com/GolosChain/golos/pull/867

const fs_helper       =   require('@fs_helper');
const golos_helper    =   require('@golos_helper');
const docker_helper   =   require('@docker_helper');
const logger          =   require('@logger');
const config          =   require("@config");
const golos           =   require('golos-js');
const assert          =   require('assert');
const MongoClient     =   require('mongodb').MongoClient;

golos.config.set('websocket', config.golosdProperties.websocket);
golos.config.set('address_prefix',config.golosdProperties.address_prefix);
golos.config.set('chain_id', config.golosdProperties.chain_id);

const Cases = {
  case1: async (containerName) => {
    try {
      logger.oklog('case1: Starting testcase');
      await fs_helper.delay(6000);
      
      await fs_helper.waitConditionChange( async ()=> {
        let hf = await golos.api.getHardforkVersionAsync();
        
        // Should be |
        //           V                  
            // return parseInt(hf.split('.')[1]) == config.golosdProperties.last_hardfork;
        // local KOCTblJlb
        return parseInt(hf.split('.')[1]) == 19;
      });

      let cli_script = "set_password qwer &&\
          unlock qwer && \
          import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS && \
          create_account cyberfounder test \\\"{}\\\" \\\"30.000 GOLOS\\\" true && \
          transfer_to_vesting cyberfounder test \\\"30.000 GOLOS\\\" true && \
          post_comment  test test \\\"\\\" test hello world \\\"{}\\\" true";
      await docker_helper.runCliWalletScript(cli_script, containerName);
      
      let apiResponse = await golos.api.getContentAsync('test', 'test', 10000);

      let mongoResponse = {};
      // Connecting to the Golos mongo db
      MongoClient.connect("mongodb://" + config.defaultMongoDbAddress, { useNewUrlParser: true }, function(err, db) {
        if (err) {
          throw err;
        }

        let dbo = db.db("Golos");
        dbo.collection("comment_object").findOne({}, function(err, result) {
          if (err) {
            throw err;
          }

          mongoResponse = result;
          console.log("mongoResponse" + mongoResponse);

          db.close();
        });
      });

      await fs_helper.waitConditionChange( async ()=> {
        return mongoResponse != {};
      });

      await logger.log("mongoResponse", mongoResponse);
      await logger.log("apiResponse", apiResponse);
// TODO FIX dates bug
      assert(mongoResponse.last_update == apiResponse.last_update);
      assert(mongoResponse.active == apiResponse.active);
      assert(mongoResponse.created == apiResponse.created);

      logger.oklog('case1: successfully passed');
      return true;
    }
    catch(err) {
      logger.log("case1: failed with error", err.message);
      return false;
    }
  }
};

module.exports.Cases = Cases;
