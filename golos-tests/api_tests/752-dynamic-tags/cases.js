// Test for 752 issue
// https://github.com/GolosChain/golos/issues/752

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
            await logger.oklog('case1: Starting testcase for tags number');
            
            await fs_helper.delay(6000); // Wait for API available
            
            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let OPERATIONS = [];
            let res = [];

            let cyberfounder = 'cyberfounder';
            let fee = '3.000 GOLOS';

            // Pre-checking tags

            res = await golos.api.getTrendingTagsAsync("", 100);
            await fs_helper.delay(6000);

            var res_wrap = {"result": res};

            var start_tags_count = jspath.apply(".result", res_wrap).length;

            // Creating test

            let authorTest3 = 'test';
            let passwordTest3 = "test";

            let wifTest3 = golos.auth.toWif(authorTest3, passwordTest3, 'posting');
            let keysTest3 = await golos_helper.generateKeys(authorTest3, passwordTest3);

            await golos_helper.createAccount(authorTest3, keysTest3, cyberfounder, fee);
            await fs_helper.delay(6000);

            // Posting comment

            let large_tag = "";
            for (var i = 0; i < 1024; i++) {
                large_tag += "1";
            }

            await golos_helper.createPost(authorTest3, wifTest3, "test", "ptest", "hello", "world", "{\"tags\":[\"" + large_tag + "\"]}");
            await fs_helper.delay(6000);

            // Creating test4

            let authorTest4 = 'test4';
            let passwordTest4 = "test4";

            let wifTest4 = golos.auth.toWif(authorTest4, passwordTest4, 'posting');
            let keysTest4 = await golos_helper.generateKeys(authorTest4, passwordTest4);

            await golos_helper.createAccount(authorTest4, keysTest4, cyberfounder, fee);
            await fs_helper.delay(6000);

            // Posting comment 2

            await golos_helper.createPost(authorTest4, wifTest4, "test", "ptest", "hello", "world", "{\"tags\":[\"1234567890\"]}");
            await fs_helper.delay(6000);

            // Checking tags

            res = await golos.api.getTrendingTagsAsync("", 100);

            await logger.oklog("Get trending tags result is", res);

            var res_wrap = {"result": res};

            await assert(jspath.apply(".result", res_wrap).length == start_tags_count + 1);

            await logger.oklog("Get trending tags result is valid");

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
