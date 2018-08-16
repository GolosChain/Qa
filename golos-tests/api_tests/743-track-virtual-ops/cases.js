// Test for 743 issue
// https://github.com/GolosChain/golos/issues/743

const jspath        =   require('jspath');
const fs_helper     =   require('@fs_helper');
const golos_helper  =   require('@golos_helper');
const logger        =   require('@logger');
const config        =   require("@config");
const golos         =   require('golos-js');
const assert        =   require('assert');

golos.config.set('websocket', config.websocket);
golos.config.set('address_prefix',config.address_prefix);
golos.config.set('chain_id', config.chain_id);

const Cases = {
    case1: async () => {
        try {
            await logger.oklog('case1: Starting testcase for set_block_applied_callback');
            
            await fs_helper.delay(6000); // Wait for API available
            
            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let OPERATIONS = [];

            let res = [];

            res = await golos.api.sendAsync("database_api", {"method": "set_block_applied_callback", "params":["virtual_ops"]});

            await logger.oklog("Block applied callback result is", res);

            await assert(jspath.apply('.operations{.op[0] === "producer_reward"}', res).length > 0);

            await logger.oklog("Block applied callback result is valid");

            await logger.oklog('case1: successfully passed');
            return true;
        }
        catch(err) {
            await logger.log("case1: failed with error", err.message);
            return false;
        }
    },
    /*case2: async () => {
        try {
            await logger.oklog('case2: Starting testcase for set_pending_transaction_callback');

            let OPERATIONS = [];

            golos.api.send("database_api", {"method": "set_pending_transaction_callback", "params":[]}, function (err, res) {
                logger.oklog("Transaction applied callback result is", res);

                //await assert(jspath.apply('.operations{.op[0] === "producer_reward"}', res).length > 0);

                logger.oklog("Transaction applied callback result is valid");
            });

            await golos.broadcast.deleteCommentAsync('test', 'test');

            await logger.oklog('case2: successfully passed');
            return true;
        }
        catch(err) {
            await logger.log("case2: failed with error", err.message);
            return false;
        }
    }*/
};

module.exports.Cases = Cases;
