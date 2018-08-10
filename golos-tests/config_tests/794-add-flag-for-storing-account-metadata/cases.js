const golos_helper  =   require('@golos_helper');
const docker_helper =   require('@docker_helper');
const fs_helper     =   require('@fs_helper');
const logger        =   require('@logger');
const config        =   require("@config");
const golos         =   require('golos-js');
const assert        =   require('assert');


golos.config.set('websocket', config.websocket);
golos.config.set('address_prefix',config.address_prefix);
golos.config.set('chain_id', config.chain_id);



const Cases = {
// 1 group
    // Case1:
    //      1. Check for default storing for all
    //      Do not add anything to config.-
    noParams: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case1-no-Params::begin");

            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setBlockLog();
            await docker_helper.setConfig(configData);

            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon's already started producing blocks
            await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let alice = 'alice';
            let passwordAlice = "alice123";

            let bob = 'bob';
            let passwordBob = "bob123";

            let cyberfounder = 'cyberfounder';
            let fee = '300.000 GOLOS';

            let jsonMetadata = '{\"test\":123}';

            let keysAlice = await golos_helper.generateKeys(alice, passwordAlice);
            let keysBob = await golos_helper.generateKeys(alice, passwordAlice);

            await golos_helper.createAccount(alice, keysAlice, cyberfounder, fee, jsonMetadata);
            await fs_helper.delay(4000);

            await golos_helper.createAccount(bob, keysBob, cyberfounder, fee, jsonMetadata);
            await fs_helper.delay(4000);

            let accounts = await golos.api.getAccountsAsync([alice, bob]);
            await logger.oklog("accounts", accounts);

            await assert(accounts[0].json_metadata == jsonMetadata);
            await logger.oklog("Alice json_metadata is empty", accounts[0].json_metadata);
            await assert(accounts[1].json_metadata == jsonMetadata);
            await logger.oklog("Bob json_metadata is empty", accounts[1].json_metadata);

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash); 

            logger.oklog("#case1-no-Params::success");
            return true;
        }
        catch(err) {
            logger.log("#case1-no-Params::failed with error", err.message);

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            return false;
        }
    },

    // Case2:
    //        1.1 Check for specified storing for all
    //        Add to config:
    //          store-account-metadata = true
    // 
    //        Do the same test.
    //        Results: same
    storeAll: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case2-store-All::begin");

            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setBlockLog();
            await docker_helper.setConfig(configData);

            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon's already started producing blocks
            await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let alice = 'alice';
            let passwordAlice = "alice123";

            let bob = 'bob';
            let passwordBob = "bob123";

            let cyberfounder = 'cyberfounder';
            let fee = '300.000 GOLOS';

            let jsonMetadata = '{\"test\":123}';

            let keysAlice = await golos_helper.generateKeys(alice, passwordAlice);
            let keysBob = await golos_helper.generateKeys(alice, passwordAlice);

            await golos_helper.createAccount(alice, keysAlice, cyberfounder, fee, jsonMetadata);
            await fs_helper.delay(4000);

            await golos_helper.createAccount(bob, keysBob, cyberfounder, fee, jsonMetadata);
            await fs_helper.delay(4000);

            let accounts = await golos.api.getAccountsAsync([alice, bob]);
            await logger.oklog("accounts", accounts);

            await assert(accounts[0].json_metadata == jsonMetadata);
            await logger.oklog("Alice json_metadata is valid", accounts[0].json_metadata);
            await assert(accounts[1].json_metadata == jsonMetadata);
            await logger.oklog("Bob json_metadata is valid", accounts[1].json_metadata);

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash); 

            logger.oklog("#case2-store-All::success");
            return true;
        }
        catch(err) {
            logger.log("#case2-store-All::failed with error", err.message);

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            return false;
        }
    },

// 2 group
// Check for restricted storing

    // Case3:
    // Add to config:
    //  store-account-metadata = false
    // 
    // But also add a list to check that the restriction works
    // store-account-metadata-list = ["cyberfounder", "alice", "bob"]
    // Do the same test.
    storeListedOnly: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case3-store-Listed-Only::begin");

            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setBlockLog();
            await docker_helper.setConfig(configData);

            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon's already started producing blocks
            await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let alice = 'alice';
            let passwordAlice = "alice123";

            let bob = 'bob';
            let passwordBob = "bob123";

            let cyberfounder = 'cyberfounder';
            let fee = '300.000 GOLOS';

            let jsonMetadata = '{\"test\":123}';

            let keysAlice = await golos_helper.generateKeys(alice, passwordAlice);
            let keysBob = await golos_helper.generateKeys(alice, passwordAlice);

            await golos_helper.createAccount(alice, keysAlice, cyberfounder, fee, jsonMetadata);
            await fs_helper.delay(4000);

            await golos_helper.createAccount(bob, keysBob, cyberfounder, fee, jsonMetadata);
            await fs_helper.delay(4000);

            let accounts = await golos.api.getAccountsAsync([alice, bob]);
            await logger.oklog("accounts", accounts);

            await assert(accounts[0].json_metadata == jsonMetadata);
            await logger.oklog("Alice json_metadata is non-empty", accounts[0].json_metadata);
            await assert(accounts[1].json_metadata == jsonMetadata);
            await logger.oklog("Bob json_metadata is non-empty", accounts[1].json_metadata);

              
            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash); 

            logger.oklog("#case3-store-Listed-Only::success");
            return true;
        }
        catch(err) {
            logger.log("#case3-store-Listed-Only::failed with error", err.message);

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            return false;
        }
    },

    // Case4: 
    //        Add to config:
    //          store-account-metadata = true
    //          store-account-metadata-list = ["cyberfounder", "bob"]
    //
    //        Do same test.
    //        Results: alice must be empty
    storeListedWithoutAlice: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case4-store-listed-without-alice::begin");
            logger.log(configData)
            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setBlockLog();
            await docker_helper.setConfig(configData);

            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon's already started producing blocks
            await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let alice = 'alice';
            let passwordAlice = "alice123";

            let bob = 'bob';
            let passwordBob = "bob123";

            let cyberfounder = 'cyberfounder';
            let fee = '300.000 GOLOS';

            let jsonMetadata = '{\"test\":123}';

            let keysAlice = await golos_helper.generateKeys(alice, passwordAlice);
            let keysBob = await golos_helper.generateKeys(alice, passwordAlice);

            await golos_helper.createAccount(alice, keysAlice, cyberfounder, fee, jsonMetadata);
            await fs_helper.delay(4000);

            await golos_helper.createAccount(bob, keysBob, cyberfounder, fee, jsonMetadata);
            await fs_helper.delay(4000);

            let accounts = await golos.api.getAccountsAsync([alice, bob]);
            await logger.oklog("accounts", accounts);

            await assert(accounts[0].json_metadata == '');
            await logger.oklog("Alice json_metadata is empty", accounts[0].json_metadata);
            await assert(accounts[1].json_metadata == jsonMetadata);
            await logger.oklog("Bob json_metadata is non-empty", accounts[1].json_metadata);

              
            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash); 

            logger.oklog("#case4-store-listed-without-alice::success");
            return true;
        }
        catch(err) {
            logger.log("#case4-store-listed-without-alice::failed with error", err.message);

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            return false;
        }
    },

    // Case5: 
    //        Add to config:
    //          store-account-metadata = false
    //        Results: all json_metadata must be empty
    storeNothing: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case5-store-nothing::begin");
            logger.log(configData)
            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setBlockLog();
            await docker_helper.setConfig(configData);

            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon's already started producing blocks
            await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let alice = 'alice';
            let passwordAlice = "alice123";

            let bob = 'bob';
            let passwordBob = "bob123";

            let cyberfounder = 'cyberfounder';
            let fee = '300.000 GOLOS';

            let jsonMetadata = '{\"test\":123}';

            let keysAlice = await golos_helper.generateKeys(alice, passwordAlice);
            let keysBob = await golos_helper.generateKeys(alice, passwordAlice);

            await golos_helper.createAccount(alice, keysAlice, cyberfounder, fee, jsonMetadata);
            await fs_helper.delay(4000);

            await golos_helper.createAccount(bob, keysBob, cyberfounder, fee, jsonMetadata);
            await fs_helper.delay(4000);

            let accounts = await golos.api.getAccountsAsync([alice, bob]);
            await logger.oklog("accounts", accounts);

            await assert(accounts[0].name == alice);
            await logger.oklog("Alice account is present", alice);
            await assert(accounts[1].name == bob);
            await logger.oklog("Bob account is present", bob);

            await assert(accounts[0].json_metadata == '');
            await logger.oklog("Alice json_metadata is empty", accounts[0].json_metadata);
            await assert(accounts[1].json_metadata == '');
            await logger.oklog("Bob json_metadata is empty", accounts[1].json_metadata);

              
            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash); 

            logger.oklog("#case5-store-nothing::success");
            return true;
        }
        catch(err) {
            logger.log("#case5-store-nothing::failed with error", err.message);

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            return false;
        }
    },



}

module.exports.Cases = Cases;
