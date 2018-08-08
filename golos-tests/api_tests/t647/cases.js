// Test for 647 issue
// https://github.com/GolosChain/golos/issues/647
// Description: Validate get_content correct result
// 1. Create user
// 2. Create post
// 3. Call get_content

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
            await logger.oklog('case1: Starting testcase');
            
            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let OPERATIONS = [];

            let alice = 'alice';
            let passwordAlice = "alice123";
            let cyberfounder = 'cyberfounder';
            let fee = '3.000 GOLOS';
            let title = 'Test Alice post title!';
            let body = 'Alice post body...';
            let jsonMetadata = '{}';
            let permlink = 'test';
            let parentPermlink = 'ptest';
            let cyberfounderKey = config.cyberfounderKey; 

            let wifAlice  = golos.auth.toWif(alice, passwordAlice, 'posting');
            let keysAlice = await golos_helper.generateKeys(alice, passwordAlice);

            await golos_helper.createAccount(alice, keysAlice, cyberfounder, fee);
            await fs_helper.delay(6000);

            await golos_helper.createPost(alice, wifAlice, permlink, parentPermlink, title, body , jsonMetadata);
            await fs_helper.delay(6000);
            
            let res = await golos.api.getContentAsync(alice, permlink, 0);
            await fs_helper.delay(6000);

            await assert(res.author == alice);
            await assert(res.permlink == permlink);
            await assert(res.category == parentPermlink);
            await assert(res.title == title);
            await assert(res.body == body);
            await assert(res.json_metadata == jsonMetadata);

            await logger.oklog("Get content returns valid result", res);

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
