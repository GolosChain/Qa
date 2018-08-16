// Test for 805, 806 issues
// https://github.com/GolosChain/golos/issues/805
// https://github.com/GolosChain/golos/issues/806

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
            await logger.oklog('case1: Starting testcase for private messages');
            
            await fs_helper.delay(6000); // Wait for API available
            
            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let OPERATIONS = [];

            let cyberfounder = 'cyberfounder';
            let fee = '3.000 GOLOS';

            // Creating test

            let authorTest = 'test';
            let passwordTest = "test";

            let wifTest = golos.auth.toWif(authorTest, passwordTest, 'posting');
            let keysTest = await golos_helper.generateKeys(authorTest, passwordTest);

            await golos_helper.createAccount(authorTest, keysTest, cyberfounder, fee);
            await fs_helper.delay(6000);

            // Creating test2

            let authorTest2 = 'test2';
            let passwordTest2 = "test2";

            let wifTest2 = golos.auth.toWif(authorTest2, passwordTest2, 'posting');
            let keysTest2 = await golos_helper.generateKeys(authorTest2, passwordTest2);

            await golos_helper.createAccount(authorTest2, keysTest2, cyberfounder, fee);
            await fs_helper.delay(6000);

            // Message

            let nonce = new Date().getTime();

            OPERATIONS.push(['private_message', {
                from: "test",
                from_memo_key: "test",
                to: "test2",
                to_memo_key: "test2",
                nonce: nonce,
                update: false,
                encrypted_message: [],
                checksum: 123
            }]);

            golos_helper.broadcastOperations(OPERATIONS);

            //let res = await golos.api.sendAsync("database_api", {"method": "set_block_applied_callback", "params":["virtual_ops"]});

            //await logger.oklog("Block applied callback result is", res);

            //await assert(jspath.apply('.operations{.op[0] === "producer_reward"}', res).length > 0);

            //await logger.oklog("Block applied callback result is valid");

            await logger.oklog('case1: successfully passed');
            return true;
        }
        catch(err) {
            await logger.log("case1: failed with error", err.message);
            return false;
        }
    }
};

module.exports.Cases = Cases;
