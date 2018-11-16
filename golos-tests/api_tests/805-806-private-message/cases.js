// Test for 805, 806 issues
// https://github.com/GolosChain/golos/issues/805
// https://github.com/GolosChain/golos/issues/806

const jspath        =   require('jspath');
const fs_helper     =   require('@fs_helper');
const golos_helper  =   require('@golos_helper');
const logger        =   require('@logger');
const config        =   require('@config');
const golos         =   require('golos-js');
const assert        =   require('assert');

golos.config.set('websocket', config.websocket);
golos.config.set('address_prefix', config.address_prefix);
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
            let res = [];

            let cyberfounder = 'cyberfounder';
            let fee = '3.000 GOLOS';

            // Creating test

            let authorTest = 'test';
            let passwordTest = 'test';

            let wifTest = golos.auth.toWif(authorTest, passwordTest, 'posting');
            let keysTest = await golos_helper.generateKeys(authorTest, passwordTest);

            await golos_helper.createAccount(authorTest, keysTest, cyberfounder, fee);
            await fs_helper.delay(6000);

            // Creating test2

            let authorTest2 = 'test2';
            let passwordTest2 = 'test2';

            let wifTest2 = golos.auth.toWif(authorTest2, passwordTest2, 'posting');
            let keysTest2 = await golos_helper.generateKeys(authorTest2, passwordTest2);

            await golos_helper.createAccount(authorTest2, keysTest2, cyberfounder, fee);
            await fs_helper.delay(6000);

            // Sending message

            let nonce = new Date().getTime();
            var json = JSON.stringify(['private_message', {
                    from: authorTest,
                    from_memo_key: keysTest.memo,
                    to: authorTest2,
                    to_memo_key: keysTest2.memo,
                    nonce: nonce,
                    update: false,
                    encrypted_message: '12345678901234561234567890123456',	// TODO implement all cryptography
                    checksum: 123						// or rewrite to cli_wallet
                }]);
            res = golos.broadcast.customJsonAsync(wifTest, [], [authorTest], 'private_message', json);
            await logger.oklog('private_message result is', res);

            // And creating a callback
            // without any waiting

            logger.oklog('Message sent callback should give result in few seconds');

            res = await golos.api.sendAsync('private_message', {'method': 'set_callback', 'params':[{}]});
            await fs_helper.delay(6000);

            logger.oklog('Message sent callback result is', res);

            await assert(jspath.apply('.message{.from === "' + authorTest + '"}', res).length == 1);
            await assert(jspath.apply('.message{.to === "' + authorTest2 + '"}', res).length == 1);
            await assert(jspath.apply('.message{.encrypted_message === "12345678901234561234567890123456"}', res).length == 1);

            await logger.oklog('And it is valid');

            // Checking inbox of test

            res = await golos.api.sendAsync('private_message', {'method': 'get_inbox', 'params':[authorTest2, {'filter_accounts': [authorTest]}]});
            await fs_helper.delay(6000);

            await logger.oklog('get_inbox result is', res);

            await assert(res.length == 0);

            await logger.oklog('And it is valid');

            res = await golos.api.sendAsync('private_message', {'method': 'get_inbox', 'params':[authorTest2, {}]});
            await fs_helper.delay(6000);

            await logger.oklog('get_inbox without filter_accounts result is', res);

            await assert(res.length > 0);

            await logger.oklog('And it is valid');

            // Checking outbox of test2

            res = await golos.api.sendAsync('private_message', {'method': 'get_outbox', 'params':[authorTest, {'filter_accounts': [authorTest2]}]});
            await fs_helper.delay(6000);

            await logger.oklog('get_outbox result is', res);

            await assert(res.length == 0);

            await logger.oklog('And it is valid');

            res = await golos.api.sendAsync('private_message', {'method': 'get_outbox', 'params':[authorTest, {}]});
            await fs_helper.delay(6000);

            await logger.oklog('get_outbox without filter_accounts result is', res);

            await assert(res.length > 0);

            await logger.oklog('And it is valid');

            await logger.oklog('case1: successfully passed');
            return true;
        }
        catch(err) {
            await logger.log('case1: failed with error', err.message);
            return false;
        }
    }
};

module.exports.Cases = Cases;
