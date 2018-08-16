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
    // Case1:
    //      Check that everything works fine without any params except default ones
    //      Do not add anything to config.
    noParams: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case1-no-params::begin");

            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setBlockLog();
            await docker_helper.setConfig(configData);

            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon's already started producing blocks
            await fs_helper.delay(3000);
            // await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let alice           = 'alice';
            let passwordAlice   = "alice123";

            let bob             = 'bob';
            let passwordBob     = "bob123";

            let cyberfounder    = 'cyberfounder';
            let fee             = '300.000 GOLOS';

            let wifAlice        = await golos.auth.toWif(alice, passwordAlice, 'posting');
            let wifBob          = await golos.auth.toWif(bob, passwordBob, 'posting');
            let keysAlice       = await golos_helper.generateKeys(alice, passwordAlice);
            let keysBob         = await golos_helper.generateKeys(bob, passwordBob);


            let title           = 'Test Alice post title!';
            let body            = 'Alice post body...';
            let jsonMetadata    = '{}';
            let permlink        = 'test';
            let parentPermlink  = 'ptest';

            let voteWeight = 50;


            await golos_helper.createAccount(alice, keysAlice, cyberfounder, fee);
            await fs_helper.delay(4000);

            await golos_helper.createAccount(bob, keysBob, cyberfounder, fee);
            await fs_helper.delay(4000);


            await golos_helper.createPost(alice, wifAlice, permlink, parentPermlink, title, body , jsonMetadata);
            await fs_helper.delay(4000);

            let post = await golos.api.getContentAsync(alice, permlink, 0);
            await fs_helper.delay(4000);

            await logger.oklog("post", post);


            await golos.broadcast.voteAsync(wifBob, bob, alice, permlink, voteWeight);
            logger.oklog("Bob voted for Alice post");
            

            let votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
            logger.oklog("Active votes right after voting", votes);
            
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

    // Case 2:
    // Add parameter:
    //  clear-votes-before-block = 2404
    clearVotesBeforeBlock: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case2-clearVotesBeforeBlock::begin");

            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setBlockLog();
            await docker_helper.setConfig(configData);

            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon's already started producing blocks
            await fs_helper.delay(3000);
            await logger.oklog("Docker Container was run")
            // await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                console.log("checking hf")
                let hf = await golos.api.getHardforkVersionAsync();
                return await parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            await logger.oklog("HF 18 was founded")

            let alice           = 'alice';
            let passwordAlice   = "alice123";

            let voters = [];

            let cyberfounder    = 'cyberfounder';
            let fee             = '300.000 GOLOS';

            let wifAlice        = await golos.auth.toWif(alice, passwordAlice, 'posting');
            let keysAlice       = await golos_helper.generateKeys(alice, passwordAlice);


            let title           = 'Test Alice post title!';
            let body            = 'Alice post body...';
            let jsonMetadata    = '{}';
            let permlink        = 'test';
            let parentPermlink  = 'ptest';

            let voteWeight = 75;


            await golos_helper.createAccount(alice, keysAlice, cyberfounder, fee);
            await fs_helper.delay(4000);

    // Creating voters 
            let votersCount = 15;

            for (let i = 0, n = votersCount; i < n; i++) {
                voters[i] = {
                    "name":  "voter" + i,
                    "password": "voter" + i + "password123"
                }
                voters[i].keys = await golos_helper.generateKeys(voters[i].name, voters[i].password);
                voters[i].wif = await golos.auth.toWif(voters[i].name, voters[i].password, 'posting');
            }

            for (let i = 0, n = 9; i < n; i++) {
                await golos_helper.createAccount(voters[i].name, voters[i].keys, cyberfounder, fee);
                await fs_helper.delay(1000);
            }
// Done

            await golos_helper.createPost(alice, wifAlice, permlink, parentPermlink, title, body , jsonMetadata);
            await fs_helper.delay(4000);

            let post = await golos.api.getContentAsync(alice, permlink, 0);
            await fs_helper.delay(4000);

            await logger.oklog("post", post);


            let createdTime = fs_helper.parseUtcString(post.created);
            let cashoutTime = fs_helper.parseUtcString(post.cashout_time);

            let beforeBlock = 4 + 1200 * 2;// 4 + 1200 * 2 == 2404 blocks
            let beforeBlockMs = beforeBlock * 3 * 1000;// 2404 * 3 sec/block * 1000 (ms) = 7212 sec 
            let beforeBlockTime = new Date(createdTime.getTime() + beforeBlockMs);

            let offset = 6 * 1000; // 6 sec
            let rightBeforeCashoutTime = new Date(cashoutTime.getTime() - offset);
            let rightBeforeBlockTime = new Date(beforeBlockTime.getTime() - offset);

            let beforeSecondCashoutTime = new Date(cashoutTime.getTime() + 60 * 60 * 1000 - offset);
            let secondCashoutTime = new Date(cashoutTime.getTime() + 60 * 60 * 1000);

            let lastCashoutCheckTime = new Date(beforeBlockTime.getTime() + 60 * 60 * 1000);
            


            await logger.oklog("Times", {
                "createdTime"               : createdTime,
                "rightBeforeCashoutTime"    : rightBeforeCashoutTime,
                "cashoutTime"               : cashoutTime,
                "beforeBlockTime"           : beforeBlockTime,
                "beforeSecondCashoutTime"   : beforeSecondCashoutTime,
                "lastCashoutCheckTime"      : lastCashoutCheckTime
            });

// vote 5 times at the begining
            for (let i = 0, n = 5; i < n; i++) {
                await golos.broadcast.voteAsync(voters[i].wif, voters[i].name, alice, permlink, voteWeight);
                logger.oklog(voters[i].name + " voted for Alice post");
            }

            let votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
            await assert(votes.length == 5);
            logger.oklog("Current active votes:", votes);
// then vote every 12 mitutes (1200 blocks / 5  == 240 block, then 240 * 3 = 720 sec)
            let interval = 720 * 1000;

            for (let i = 5, n = 9; i < n; i++) {
                await golos.broadcast.voteAsync(voters[i].wif, voters[i].name, alice, permlink, voteWeight);
                await logger.oklog(voters[i].name + " voted for Alice post");
                let intervalTime = Date.now() + interval;
                await fs_helper.waitConditionChange(()=> {
                    return fs_helper.compareDates(Date.now(), intervalTime);
                }, 0);

                votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
                await assert(votes.length == i + 1);
                logger.oklog("Current active votes:", votes);
            }

// Waiting time right before cashout
            await fs_helper.waitConditionChange(()=> {
                    return fs_helper.compareDates(Date.now(), rightBeforeCashoutTime);
            }, 0);

// Check that everything is present
            post = await golos.api.getContentAsync(alice, permlink, 0);
            logger.log("post", post);

            await assert(post.mode != 'archived')
            logger.oklog("post.mode != \'archived\'");

            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
            await assert(votes.length == 9);
            logger.oklog("Current active votes:", votes);

// Waiting cashout
            await fs_helper.waitConditionChange(()=> {
                    return fs_helper.compareDates(Date.now(), cashoutTime);
            });

            post = await golos.api.getContentAsync(alice, permlink, 0);
            await fs_helper.delay(4000);
            logger.log("post", post);

            await assert(post.mode == 'archived')
            logger.oklog("post.mode == \'archived\'");

// Checked all votes have been cleaned.
            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
            await assert(votes.length == 0);
            logger.oklog("Current active votes:", votes);
            // add assett( = 0);

            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), beforeSecondCashoutTime);
            }, 0);

// Vote one time right before "beforeBlock"
            await golos.broadcast.voteAsync(voters[9].wif, voters[9].name, alice, permlink, voteWeight);
            logger.oklog(voters[9].name + " voted for Alice post");

            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
            await assert(votes.length == 1);
            logger.oklog("Current active votes:", votes);

            // assert (count == 1)

// Make sure that there are no votes after beforeBlock
            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), beforeBlockTime);
            });

            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
            await assert(votes.length == 0);
            logger.oklog("Current active votes:", votes);

            // assert (votes count == 0)

// Vote 5 times and make sure everyhting is still stored after one hour

            for (let i = 10, n = votersCount; i < n; i++) {
                await golos.broadcast.voteAsync(voters[i].wif, voters[i].name, alice, permlink, voteWeight);
                logger.oklog(voters[i].name + " voted for Alice post");
            }
            

            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), lastCashoutCheckTime);
            });

            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
            await assert(votes.length == 5);
            logger.oklog("Current active votes:", votes);



            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash); 

            logger.oklog("#case2-clearVotesBeforeBlock::success");
            return true;
        }
        catch(err) {
            logger.log("#case2-clearVotesBeforeBlock::failed with error", err.message);

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            return false;
        }
    },

    clearVotesBeforeCashoutBlock: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case3-clearVotesBeforeCashoutBlock::begin");

            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setBlockLog();
            await docker_helper.setConfig(configData);

            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon's already started producing blocks
            await fs_helper.delay(3000);
            // await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let alice           = 'alice';
            let passwordAlice   = "alice123";

            let voters = [];

            let cyberfounder    = 'cyberfounder';
            let fee             = '300.000 GOLOS';

            let wifAlice        = await golos.auth.toWif(alice, passwordAlice, 'posting');
            let keysAlice       = await golos_helper.generateKeys(alice, passwordAlice);


            let title           = 'Test Alice post title!';
            let body            = 'Alice post body...';
            let jsonMetadata    = '{}';
            let permlink        = 'test';
            let parentPermlink  = 'ptest';

            let voteWeight = 75;


            await golos_helper.createAccount(alice, keysAlice, cyberfounder, fee);
            await fs_helper.delay(4000);

            // Creating voters 
            let votersCount = 10;

            for (let i = 0, n = votersCount; i < n; i++) {
                voters[i] = {
                    "name":  "voters" + i,
                    "password": "voters" + i + "password123"
                }
                voters[i].keys = await golos_helper.generateKeys(voters[i].name, voters[i].password);
                voters[i].wif = await golos.auth.toWif(voters[i].name, voters[i].password, 'posting');
            }

            for (let i = 0, n = 9; i < n; i++) {
                await golos_helper.createAccount(voters[i].name, voters[i].keys, cyberfounder, fee);
                await fs_helper.delay(4000);
            }
            // Done

            await golos_helper.createPost(alice, wifAlice, permlink, parentPermlink, title, body , jsonMetadata);
            await fs_helper.delay(4000);

            let post = await golos.api.getContentAsync(alice, permlink, 0);
            await fs_helper.delay(4000);

            await logger.oklog("post", post);


            let createdTime = fs_helper.parseUtcString(post.created);
            let cashoutTime = fs_helper.parseUtcString(post.cashout_time);

            let beforeBlock = 600; // cashout (1200 blocks) / 2
            let beforeBlockMs = beforeBlock * 3 * 1000;// 600 * 3 sec/block * 1000 (ms) = 1800 sec 
            let beforeBlockTime = new Date(createdTime.getTime() + beforeBlockMs);

            let offset = 6 * 1000; // 6 sec
            let rightBeforeCashoutTime = new Date(cashoutTime.getTime() - offset);

            await logger.oklog("Times", {
                "createdTime"               : createdTime,
                "rightBeforeCashoutTime"    : rightBeforeCashoutTime,
                "cashoutTime"               : cashoutTime,
                "beforeBlockTime"           : beforeBlockTime
            });

// vote 5 times at the begining
            for (let i = 0, n = 5; i < n; i++) {
                await golos.broadcast.voteAsync(voters[i].wif, voters[i].name, alice, permlink, voteWeight);
                logger.oklog(voters[i].name + " voted for Alice post");
            }

            let votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);

            await assert(votes.length == 5);
            logger.oklog("Current active votes:", votes);

// then vote every 12 mitutes (1200 blocks / 5  == 240 block, then 240 * 3 = 720 sec)

            let interval = 720 * 1000;

            for (let i = 5, n = 9; i < n; i++) {
                await golos.broadcast.voteAsync(voters[i].wif, voters[i].name, alice, permlink, voteWeight);
                await logger.oklog(voters[i].name + " voted for Alice post");
                let intervalTime = Date.now() + interval;
                await fs_helper.waitConditionChange(()=> {
                    return fs_helper.compareDates(Date.now(), intervalTime);
                }, 0);

                votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
                await assert(votes.length == i + 1);
                logger.oklog("Current active votes:", votes);
            }
// Done with voting

            // Waiting time right before cashout
            await fs_helper.waitConditionChange(()=> {
                    return fs_helper.compareDates(Date.now(), rightBeforeCashoutTime);
            }, 0);

            // Check that everything is present
            post = await golos.api.getContentAsync(alice, permlink, 0);
            logger.log("post", post);

            await assert(post.mode != 'archived')
            logger.oklog("post.mode != \'archived\'");

            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);

            await assert(votes.length == 9);
            logger.oklog("Current active votes:", votes);

            // Waiting cashout
            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), cashoutTime);
            });

            post = await golos.api.getContentAsync(alice, permlink, 0);
            await fs_helper.delay(4000);
            logger.log("post", post);

            await assert(post.mode == 'archived')
            logger.oklog("post.mode == \'archived\'");

            // Checked all votes have been cleaned.
            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
            await assert(votes.length == 9);
            logger.oklog("Current active votes:", votes);


            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash); 

            logger.oklog("#case3-clearVotesBeforeCashoutBlock::success");
            return true;
        }
        catch(err) {
            logger.log("#case3-clearVotesBeforeCashoutBlock::failed with error", err.message);

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            return false;
        }
    },

    clearVotesOlderNLargerCashout: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case4-clearVotesOlderNLargerCashout::begin");

            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setBlockLog();
            await docker_helper.setConfig(configData);

            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon's already started producing blocks
            await fs_helper.delay(3000);
            // await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let alice           = 'alice';
            let passwordAlice   = "alice123";

            let voters = [];

            let cyberfounder    = 'cyberfounder';
            let fee             = '300.000 GOLOS';

            let wifAlice        = await golos.auth.toWif(alice, passwordAlice, 'posting');
            let keysAlice       = await golos_helper.generateKeys(alice, passwordAlice);


            let title           = 'Test Alice post title!';
            let body            = 'Alice post body...';
            let jsonMetadata    = '{}';
            let permlink        = 'test';
            let parentPermlink  = 'ptest';

            let voteWeight = 75;


            await golos_helper.createAccount(alice, keysAlice, cyberfounder, fee);
            await fs_helper.delay(4000);

            // Creating voters 
            let votersCount = 20;

            for (let i = 0, n = votersCount; i < n; i++) {
                voters[i] = {
                    "name":  "voters" + i,
                    "password": "voters" + i + "password123"
                }
                voters[i].keys = await golos_helper.generateKeys(voters[i].name, voters[i].password);
                voters[i].wif = await golos.auth.toWif(voters[i].name, voters[i].password, 'posting');
            }

            for (let i = 0, n = 9; i < n; i++) {
                await golos_helper.createAccount(voters[i].name, voters[i].keys, cyberfounder, fee);
                await fs_helper.delay(4000);
            }
            // Done

            await golos_helper.createPost(alice, wifAlice, permlink, parentPermlink, title, body , jsonMetadata);
            await fs_helper.delay(4000);

            let post = await golos.api.getContentAsync(alice, permlink, 0);
            await fs_helper.delay(4000);

            await logger.oklog("post", post);


            let createdTime = fs_helper.parseUtcString(post.created);
            let cashoutTime = fs_helper.parseUtcString(post.cashout_time);

            let blockN = 1200 * 2; // cashout (1200 blocks) / 2
            let blockNMs = beforeBlock * 3 * 1000;// 600 * 3 sec/block * 1000 (ms) = 1800 sec 
            let blockNTime = new Date(createdTime.getTime() + blockNMs);

            let offset = 6 * 1000; // 6 sec
            let rightBeforeCashoutTime = new Date(cashoutTime.getTime() - offset);
            let rightBeforeN = new Date(blockNTime.getTime() - offset);

            await logger.oklog("Times", {
                "createdTime"               : createdTime,
                "rightBeforeCashoutTime"    : rightBeforeCashoutTime,
                "cashoutTime"               : cashoutTime,
                "beforeBlockTime"           : beforeBlockTime
            });

            // vote 5 times at the begining
            for (let i = 0, n = 5; i < n; i++) {
                await golos.broadcast.voteAsync(voters[i].wif, voters[i].name, alice, permlink, voteWeight);
                logger.oklog(voters[i].name + " voted for Alice post");
            }

            let votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
            await assert(votes.length == 5);
            logger.oklog("Current active votes:", votes);

            // then vote every 12 mitutes (1200 blocks / 5  == 240 block, then 240 * 3 = 720 sec)

            let interval = 720 * 1000;

            for (let i = 5, n = 9; i < n; i++) {
                await golos.broadcast.voteAsync(voters[i].wif, voters[i].name, alice, permlink, voteWeight);
                await logger.oklog(voters[i].name + " voted for Alice post");
                let intervalTime = Date.now() + interval;
                await fs_helper.waitConditionChange(()=> {
                    return fs_helper.compareDates(Date.now(), intervalTime);
                }, 0);

                votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
                await assert(votes.length == i + 1);
                logger.oklog("Current active votes:", votes);
            }
            //

            // Waiting time right before cashout
            await fs_helper.waitConditionChange(()=> {
                    return fs_helper.compareDates(Date.now(), rightBeforeCashoutTime);
            }, 0);

            // Check that everything is present
            post = await golos.api.getContentAsync(alice, permlink, 0);
            logger.log("post", post);

            await assert(post.mode != 'archived')
            logger.oklog("post.mode != \'archived\'");

            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
            await assert(votes.length == 9);
            logger.oklog("Current active votes:", votes);

            // Waiting cashout
            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), cashoutTime);
            });

            post = await golos.api.getContentAsync(alice, permlink, 0);
            await fs_helper.delay(4000);
            logger.log("post", post);

            await assert(post.mode == 'archived')
            logger.oklog("post.mode == \'archived\'");

            // Check that all votes are still present.
            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
            logger.oklog("Current active votes:", votes);
            await assert(votes.length == 9);

            // Waiting rightBeforeN
            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), rightBeforeN);
            }, 0);


            await golos.broadcast.voteAsync(voters[9].wif, voters[9].name, alice, permlink, voteWeight);
            await logger.oklog(voters[9].name + " voted for Alice post");

            // Check that all 10 votes are still present.
            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);

            logger.oklog("Current active votes:", votes);
            await assert(votes.length == 10);
            

            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), blockNTime);
            });

            await delay(4000);

            // Check that only 6 votes are still present.
            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);

            logger.oklog("Current active votes:", votes);
            await assert(votes.length == 4);
            
            // then vote 4 times every 30 sec

            interval = 10 * 3 * 1000;

            for (let i = 9, n = 13; i < n; i++) {
                await golos.broadcast.voteAsync(voters[i].wif, voters[i].name, alice, permlink, voteWeight);
                await logger.oklog(voters[i].name + " voted for Alice post");
                let intervalTime = Date.now() + interval;
                await fs_helper.waitConditionChange(()=> {
                    return fs_helper.compareDates(Date.now(), intervalTime);
                }, 0);

                votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
                await assert(votes.length == i + 1);
                logger.oklog("Current active votes:", votes);
            }
            //

            await golos.broadcast.voteAsync(voters[14].wif, voters[14].name, alice, permlink, voteWeight);
            await logger.oklog(voters[14].name + " voted for Alice post");

            // Check that 9 votes are still present.
            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);

            logger.oklog("Current active votes:", votes);
            await assert(votes.length == 9);

            let nBlocksIntervalTime = new Date(Data.now().getTime() + blockNMs);

            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), nBlocksIntervalTime);
            });
                
            // Check that only 1 vote is stored.
            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);

            logger.oklog("Current active votes:", votes);
            await assert(votes.length == 1);

            await delay(6000);

            // Check that only 0 votes are present.
            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);

            logger.oklog("Current active votes:", votes);
            await assert(votes.length == 0);


            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash); 

            logger.oklog("#case4-clearVotesOlderNLargerCashout::success");
            return true;
        }
        catch(err) {
            logger.log("#case4-clearVotesOlderNLargerCashout::failed with error", err.message);

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            return false;
        }
    },


    clearVotesOlderNSmallerСashout: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case5-clearVotesOlderNSmallerСashout::begin");

            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setBlockLog();
            await docker_helper.setConfig(configData);

            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon's already started producing blocks
            await fs_helper.delay(3000);
            // await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let alice           = 'alice';
            let passwordAlice   = "alice123";

            let voters = [];

            let cyberfounder    = 'cyberfounder';
            let fee             = '300.000 GOLOS';

            let wifAlice        = await golos.auth.toWif(alice, passwordAlice, 'posting');
            let keysAlice       = await golos_helper.generateKeys(alice, passwordAlice);


            let title           = 'Test Alice post title!';
            let body            = 'Alice post body...';
            let jsonMetadata    = '{}';
            let permlink        = 'test';
            let parentPermlink  = 'ptest';

            let voteWeight = 75;


            await golos_helper.createAccount(alice, keysAlice, cyberfounder, fee);
            await fs_helper.delay(4000);

            // Creating voters 
            let votersCount = 15;

            for (let i = 0, n = votersCount; i < n; i++) {
                voters[i] = {
                    "name":  "voters" + i,
                    "password": "voters" + i + "password123"
                }
                voters[i].keys = await golos_helper.generateKeys(voters[i].name, voters[i].password);
                voters[i].wif = await golos.auth.toWif(voters[i].name, voters[i].password, 'posting');
            }

            for (let i = 0, n = 9; i < n; i++) {
                await golos_helper.createAccount(voters[i].name, voters[i].keys, cyberfounder, fee);
                await fs_helper.delay(4000);
            }
            // Done

            await golos_helper.createPost(alice, wifAlice, permlink, parentPermlink, title, body , jsonMetadata);
            await fs_helper.delay(4000);

            let post = await golos.api.getContentAsync(alice, permlink, 0);
            await fs_helper.delay(4000);

            await logger.oklog("post", post);


            let createdTime = fs_helper.parseUtcString(post.created);
            let cashoutTime = fs_helper.parseUtcString(post.cashout_time);

            let blockN = 1200 / 4; // cashout (1200 blocks) / 4
            let blockNMs = beforeBlock * 3 * 1000;// 600 * 3 sec/block * 1000 (ms) = 1800 sec 
            let blockNTime = new Date(createdTime.getTime() + blockNMs);

            let offset = 6 * 1000; // 6 sec
            let rightBeforeCashoutTime = new Date(cashoutTime.getTime() - offset);

            await logger.oklog("Times", {
                "createdTime"               : createdTime,
                "rightBeforeCashoutTime"    : rightBeforeCashoutTime,
                "cashoutTime"               : cashoutTime,
                "beforeBlockTime"           : beforeBlockTime
            });
            
// ---------------- vote 10 times and check votes stored ---------------------------------
            // vote 5 times at the begining
            for (let i = 0, n = 5; i < n; i++) {
                await golos.broadcast.voteAsync(voters[i].wif, voters[i].name, alice, permlink, voteWeight);
                logger.oklog(voters[i].name + " voted for Alice post");
            }

            let votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
            await assert(votes.length == 5);
            logger.oklog("Current active votes:", votes);

            // then vote every 12 mitutes (1200 blocks / 5  == 240 block, then 240 * 3 = 720 sec)

            let interval = 720 * 1000;

            for (let i = 5, n = 9; i < n; i++) {
                await golos.broadcast.voteAsync(voters[i].wif, voters[i].name, alice, permlink, voteWeight);
                await logger.oklog(voters[i].name + " voted for Alice post");
                let intervalTime = Date.now() + interval;
                await fs_helper.waitConditionChange(()=> {
                    return fs_helper.compareDates(Date.now(), intervalTime);
                }, 0);

                votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);
                await assert(votes.length == i + 1);
                logger.oklog("Current active votes:", votes);
            }

            await golos.broadcast.voteAsync(voters[9].wif, voters[9].name, alice, permlink, voteWeight);
            await logger.oklog(voters[9].name + " voted for Alice post");
// -------------------------go to 1 block before cashout and check 10 votes are stored-----------------
            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), rightBeforeCashoutTime);
            }, 0);
            // Check that all 10 votes are still present.
            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);

            logger.oklog("Current active votes:", votes);
            await assert(votes.length == 10);
            await delay(4000);
// ------------------------- go to cashout block and check 8 votes were removed-----------------

            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), cashoutTime);
            });

            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);

            logger.oklog("Current active votes:", votes);
            await assert(votes.length == 2);
            
// -------------- go forward just before last vote should be removed and check it stored ----------
            
            let beforeLastVoteDelete = new Date(cashoutTime.getTime() +  blockNMs - interval);
            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), );
            }, 0);

            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);

            logger.oklog("Current active votes:", votes);
            await assert(votes.length == 1);
            

// -------------- go 1 block forward and check all votes removed ----------------------------------

            await delay(4000);
            // Check that only 0 votes are present.
            votes = await golos.api.getActiveVotesAsync(alice, permlink, -1);

            logger.oklog("Current active votes:", votes);
            await assert(votes.length == 0);


            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash); 

            logger.oklog("#case5-clearVotesOlderNSmallerСashout::success");
            return true;
        }
        catch(err) {
            logger.log("#case5-clearVotesOlderNSmallerСashout::failed with error", err.message);

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            return false;
        }
    }

}

module.exports.Cases = Cases;
