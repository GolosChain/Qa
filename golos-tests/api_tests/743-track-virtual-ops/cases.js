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
            await logger.oklog('case1: Starting testcase for set_block_applied_callback with virtual_ops');

            await fs_helper.delay(6000); // Wait for API available

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let OPERATIONS = [];

            let res = [];

            await logger.oklog("Block applied callback should give result in few seconds...");

            res = await golos.api.sendAsync("database_api", {"method": "set_block_applied_callback", "params":["virtual_ops"]});

            await logger.oklog("Block applied callback result is", res);

            await assert(jspath.apply('.operations{.op[0] === "producer_reward"}', res).length > 0);

            await logger.oklog("And it is valid");

            await logger.oklog('case1: successfully passed');
            return true;
        }
        catch(err) {
            await logger.log("case1: failed with error", err.message);
            return false;
        }
    },
    case2: async () => {
        try {
            await logger.oklog('case2: Starting testcase for set_block_applied_callback with block');

            await fs_helper.delay(6000); // Wait for API available

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let OPERATIONS = [];

            let res = [];

            await logger.oklog("Block applied callback should give result in few seconds...");

            // We just ensuring it is don't crashing
            res = await golos.api.sendAsync("database_api", {"method": "set_block_applied_callback", "params":["block"]});

            await logger.oklog("Block applied callback result is", res);

            await logger.oklog('case2: successfully passed');
            return true;
        }
        catch(err) {
            await logger.log("case2: failed with error", err.message);
            return false;
        }
    },
    case3: async () => {
        try {
            await logger.oklog('case3: Starting testcase for set_block_applied_callback with full');

            await fs_helper.delay(6000); // Wait for API available

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let OPERATIONS = [];

            let res = [];

            await logger.oklog("Block applied callback should give result in few seconds...");

            res = await golos.api.sendAsync("database_api", {"method": "set_block_applied_callback", "params":["full"]});

            await logger.oklog("Block applied callback result is", res);

            await assert(jspath.apply('._virtual_operations{.op[0] === "producer_reward"}', res).length > 0);

            await logger.oklog("And it is valid");

            await logger.oklog('case3: successfully passed');
            return true;
        }
        catch(err) {
            await logger.log("case3: failed with error", err.message);
            return false;
        }
    },
    case4: async () => {
        try {
            await logger.oklog('case4: Starting testcase for set_block_applied_callback with header');

            await fs_helper.delay(6000); // Wait for API available

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let OPERATIONS = [];

            let res = [];

            await logger.oklog("Block applied callback should give result in few seconds...");

            // We just ensuring it don't crashing
            res = await golos.api.sendAsync("database_api", {"method": "set_block_applied_callback", "params":["header"]});

            await logger.oklog("Block applied callback result is", res);

            await logger.oklog('case4: successfully passed');
            return true;
        }
        catch(err) {
            await logger.log("case4: failed with error", err.message);
            return false;
        }
    },
    case5: async () => {
        try {
            await logger.oklog('case5: Starting testcase for set_pending_transaction_callback');

            await fs_helper.delay(6000); // Wait for API available

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let OPERATIONS = [];

            let cyberfounder = 'cyberfounder';
            let fee = '3.000 GOLOS';

            // Creating testasync account

            let authorTestAsync = 'testasync';
            let passwordTestAsync = "testasync";

            let wifTestAsync = golos.auth.toWif(authorTestAsync, passwordTestAsync, 'posting');
            let keysTestAsync = await golos_helper.generateKeys(authorTestAsync, passwordTestAsync);

            await golos_helper.createAccount(authorTestAsync, keysTestAsync, cyberfounder, fee);

            // And creating a callback
            // without any waiting

            let res = await golos.api.sendAsync("database_api", {"method": "set_pending_transaction_callback", "params":[]});
            await fs_helper.delay(6000);

            logger.oklog("Transaction applied callback result is", res);

            await assert(jspath.apply('.operations{.[0] === "account_create" && .[1].new_account_name === "'
                + authorTestAsync + '"}', res).length != 0);

            logger.oklog("Transaction applied callback result is valid");

            //

            await logger.oklog('case5: successfully passed');
            return true;
        }
        catch(err) {
            await logger.log("case5: failed with error", err.message);
            return false;
        }
    }
};

module.exports.Cases = Cases;
