// Test for 816 issue: https://github.com/GolosChain/golos/issues/816
const fs_helper     = require('@fs_helper');
const golos_helper  = require('@golos_helper');
const logger        = require('@logger');
const config  = require("@config");
const golos         = require('golos-js');
const assert        = require('assert');

golos.config.set('websocket', config.websocket);
golos.config.set('address_prefix',config.address_prefix);
golos.config.set('chain_id', config.chain_id);

const broadcastTransaction = (OPERATIONS, cyberfounderKey) => {
    golos.broadcast.send(
    {
        extensions: [], 
        OPERATIONS
    }, [cyberfounderKey], function(err, res) {
        if (err) {
            logger.log(err)
        }
        else {
            logger.log(res)
        }
    });
}

const Cases = {
    case1: async () => {
        try {
            logger.oklog('case1: Starting testcase');

            let OPERATIONS = [];

            let alice           = 'alice';
            let bob             = 'bob';
            let dave            = 'dave';

            let passwordAlice   = "alice123";
            let passwordBob     = "bob123";
            let passwordDave    = "dave123";

            let cyberfounder    = 'cyberfounder';
            let fee             = '3.000 GOLOS';

            let title = 'Test Dave post title!';
            let body = 'Dave post body...';
            let jsonMetadata = '{}';

            let permlink = 'test';
            let parentPermlink = 'ptest';

            let cyberfounderKey = config.cyberfounderKey; 

            let wifAlice   = golos.auth.toWif(alice, passwordAlice, 'posting');
            let wifBob     = golos.auth.toWif(bob, passwordBob, 'posting');
            let wifDave    = golos.auth.toWif(dave, passwordDave, 'posting');

            let keysAlice  = await golos_helper.generateKeys(alice, passwordAlice);
            let keysBob    = await golos_helper.generateKeys(bob, passwordBob);
            let keysDave   = await golos_helper.generateKeys(dave, passwordBob);

            await logger.log("wif alice", wifAlice)
            await logger.log("keys alice", keysAlice)

            await golos_helper.createAccount(alice, keysAlice, cyberfounder, fee);
            await fs_helper.delay(4000);

            await golos_helper.createAccount(bob, keysBob, cyberfounder, fee);
            await fs_helper.delay(4000);

            await golos_helper.createAccount(dave, keysDave, cyberfounder, fee);
            await fs_helper.delay(4000);

            await OPERATIONS.push(
                ["custom_json", {
                    "required_posting_auths": ["alice"],
                    "id": "follow",
                    "json": "[\"follow\", {\"follower\":\"alice\",\"following\":\"bob\",\"what\":[\"blog\"]}]"
                }]
            );
            await broadcastTransaction(OPERATIONS, cyberfounderKey);
            OPERATIONS = [];

            await golos_helper.createPost(dave, wifDave, permlink, parentPermlink, title, body, jsonMetadata);

            await OPERATIONS.push(
                ["custom_json", {
                    "required_posting_auths": ["bob"],
                    "id": "follow",
                    "json": "[\"reblog\", {\"account\":\"bob\",\"author\":\"dave\",\"permlink\":\"test\"}]"
                }]
            );
            await broadcastTransaction(OPERATIONS, cyberfounderKey);
            OPERATIONS = [];

            await golos.tags.get_discussions_by_feed({
                "limit": 100,
                "truncate_body": 1024,
                "vote_limit": 1,
                "select_authors": ["alice"]
            });
            


            




            logger.oklog('case1: successfully passed');
        }
        catch(err) {
            logger.log("case1: failed with error", err.message);
        }
    }
};

module.exports.Cases = Cases;
