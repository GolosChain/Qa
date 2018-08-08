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
    case1: async (data) => {
        try {
            await logger.oklog('case1: Starting testcase');
            await fs_helper.delay(3000);
            await logger.oklog("ALOHA!")
            await logger.oklog(data )
            // let OPERATIONS = [];

            // let alice = 'alice';
            // let bob = 'bob';
            // let passwordAlice = "alice123";
            // let passwordBob = "bob123";
            // let cyberfounder = 'cyberfounder';
            // let fee = '3.000 GOLOS';
            // let title = 'Test Alice post title!';
            // let body = 'Alice post body...';
            // let jsonMetadata = '{}';
            // let permlink = 'test';
            // let parentPermlink = 'ptest';
            // let cyberfounderKey = config.cyberfounderKey; 

            // let wifAlice  = golos.auth.toWif(alice, passwordAlice, 'posting');
            // let wifBob    = golos.auth.toWif(bob, passwordAlice, 'posting');
            // let keysAlice = await golos_helper.generateKeys(alice, passwordAlice);
            // let keysBob   = await golos_helper.generateKeys(Bob, passwordBob);

            // await golos_helper.createAccount(alice, keysAlice, cyberfounder, fee);
            // await fs_helper.delay(4000);

            // await golos_helper.createAccount(bob, keysBob, cyberfounder, fee);
            // await fs_helper.delay(4000);
            // // addAccountUpdate 

            // await OPERATIONS.push(
            //     ["account_update", 
            //         {
            //             "account":"alice",
            //             "posting": {
            //                 "weight_threshold":1,
            //                 "account_auths": [
            //                     ["bob",1]
            //                 ],
            //                 "key_auths": [ 
            //                     ["GLS6UADxV2WAAmZxGNd7AKCPW9fXoL2XqrUYBS1Y3Ptyf3v4D9BJb",1]
            //                 ]
            //             }
            //         }
            //     ]
            // );
            // await golos.broadcast.send(
            // {
            //     extensions: [], 
            //     OPERATIONS
            // }, [cyberfounderKey], function(err, res) {
            //     if (err) {
            //         logger.log(err)
            //     }
            //     else {
            //         logger.log(res)
            //     }
            // });

            // await golos_helper.createPost(alice, wifAlice, permlink, parentPermlink, title, body , jsonMetadata);
            


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
