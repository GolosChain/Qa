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
    //      Try to create an account and make post from it.
    //      Check the post's presence and valid content fields.
    noParams: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case1::begin");

            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setBlockLog();
            await docker_helper.setConfig(configData);

            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon've already started producing blocks
            await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let author = 'alice';
            let password = "alice123";
            let cyberfounder = 'cyberfounder';
            let fee = '300.000 GOLOS';
            let title = 'Test Alice post title!';
            let body = 'Alice post body...';
            let jsonMetadata = '{}';
            let permlink = 'test';
            let parentPermlink = 'ptest';

            let wif = golos.auth.toWif(author, password, 'posting');
            let keys = await golos_helper.generateKeys(author, password);

            await golos_helper.createAccount(author, keys, cyberfounder, fee);
            await fs_helper.delay(4000);
            await golos_helper.createPost(author, wif, permlink, parentPermlink, title, body , jsonMetadata);
            await fs_helper.delay(4000);
            let content = await golos.api.getContentAsync(author, permlink, 0);
            await fs_helper.delay(4000);

            await logger.log("content", content);
            
            await assert(content.title == title);
            logger.oklog("title field is valid", {'title' : content.title});
            await assert(content.body == body);
            logger.oklog("body field is valid", {'body' : content.body});
            await assert(content.json_metadata == jsonMetadata);
            logger.oklog("json_metadata field is valid", {'json_metadata' : content.json_metadata});

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash); 

            logger.oklog("#case1::success");
            return true;
        }
        catch(err) {
            logger.log("#case1::failed with error", err.message);

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            return false;
        }
    },

    // Case2:
    //      config2.ini contains params: 
    //          comment-title-depth = 0
    //          comment-body-depth = 0
    //          comment-json-metadata-depth = 0 
    //      Try to create an account and make post from it.
    //      Check the post's presence and make sure that content fields are empty.
    doNotStoreContent: async (configData) => {
        let containerHash = '';
        try {
            await logger.oklog("#case2::begin");

            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setConfig(configData);

            await docker_helper.setBlockLog();
            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon've already started producing blocks
            await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let author = 'bob';
            let password = 'bob123';
            let cyberfounder = 'cyberfounder';
            let fee = '300.000 GOLOS';
            let title = 'Test bob post title!';
            let body = 'Bob post body...';
            let jsonMetadata = '{}';
            let permlink = 'test';
            let parentPermlink = 'ptest';

            let wif = golos.auth.toWif(author, password, 'posting');
            let keys = await golos_helper.generateKeys(author, password);

            await golos_helper.createAccount(author, keys, cyberfounder, fee);

            await fs_helper.delay(6000);
            await golos_helper.createPost(author, wif, permlink, parentPermlink, title, body , jsonMetadata);

            await fs_helper.delay(6000);
            let content = await golos.api.getContentAsync(author, permlink, 0);

            await fs_helper.delay(4000);
            await logger.log("content", content);
            
            await assert(content.title == '');
            logger.oklog("title field is empty", {'title' : content.title});
            await assert(content.body == '');
            logger.oklog("body field is empty", {'body' : content.body});
            await assert(content.json_metadata == '');
            logger.oklog("json_metadata field is empty", {'json_metadata' : content.json_metadata});

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            await logger.oklog("#case2::success");

            return true;
        }
        catch(err) {
            logger.elog("#case2::failed with error", err.message);
            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);
            return false;
        } 
    },

    // Case3:
    //  lets test when `depth * 3 < STEEMIT_CASHOUT_WINDOW_SECONDS`
    //  Thus first lets set parameter `comment-title-depth = 1000`
    //  As #define STEEMIT_CASHOUT_WINDOW_SECONDS          (60*60) /// 1 hour
    //  60*60 == 3600
    //  Or its equal to 1200 blocks * 3 sec
    //  comment-title-depth = 1000
    //  comment-body-depth = 0
    //  comment-json-metadata-depth = 0 
    depthLessThanCashout: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case3::begin");

            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setConfig(configData);

            await docker_helper.setBlockLog();
            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon've already started producing blocks
            await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let author = 'calvin';
            let password = 'calvin123';
            let cyberfounder = 'cyberfounder';
            let fee = '300.000 GOLOS';
            let title = 'Test calvin post title!';
            let body = 'Calvin post body...';
            let jsonMetadata = '{}';
            let permlink = 'test';
            let parentPermlink = 'ptest';

            let wif = golos.auth.toWif(author, password, 'posting');
            let keys = await golos_helper.generateKeys(author, password);

            await golos_helper.createAccount(author, keys, cyberfounder, fee);
            await fs_helper.delay(4000);
            await golos_helper.createPost(author, wif, permlink, parentPermlink, title, body , jsonMetadata);
            await fs_helper.delay(4000);
            let content = await golos.api.getContentAsync(author, permlink, 0);
            
            
            await assert(content.title == title);
            logger.oklog("After create: title field is valid", {'title' : content.title});
            await assert(content.body == '');
            logger.oklog("After create: body field is valid", {'body' : content.body});
            await assert(content.json_metadata == '');
            logger.oklog("After create: json_metadata field is valid", {'json_metadata' : content.json_metadata});

            await logger.log("calvin content", content);

            let cashoutTime = fs_helper.parseUtcString(content.cashout_time);
            let createdTime = fs_helper.parseUtcString(content.created);
            let expectedDeleteContentTime = new Date(createdTime.getTime() + 1000 * 3 * 1000);

            // Needed to make api call on the next block, thats why + 3sec -- 6sec
            let actualDeleteContentTime = new Date(cashoutTime.getTime() + 6 * 1000);

            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), expectedDeleteContentTime);
            });

            content = await golos.api.getContentAsync(author, permlink, 0);

            await assert(content.title == title);
            logger.oklog("After expected delete content time: title field is non-empty", {'title' : content.title});

            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), actualDeleteContentTime);
            });

            content = await golos.api.getContentAsync(author, permlink, 0);

            assert(content.title == '');
            await logger.oklog("title field was cleaned", {'title' : content.title});

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            logger.oklog("#case3::success");
            return true;
        }
        catch(err) {
            logger.elog("#case3::failed with error", err.message);
            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);
            return false
        }
    },

    // Case4:
    //  lets test when `depth * 3 > STEEMIT_CASHOUT_WINDOW_SECONDS`
    //  Thus first lets set parameter `comment-title-depth = 1250`
    //  As #define STEEMIT_CASHOUT_WINDOW_SECONDS          (60*60) /// 1 hour
    //  60*60 == 3600 
    //  comment-title-depth = 1250
    //  comment-body-depth = 0
    //  comment-json-metadata-depth = 0 
    depthGreaterThanCashout: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case4::begin");

            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setConfig(configData);

            await docker_helper.setBlockLog();
            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon've already started producing blocks
            await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let author = 'david';
            let password = 'david123';
            let cyberfounder = 'cyberfounder';
            let fee = '300.000 GOLOS';
            let title = 'Test David post title!';
            let body = 'David post body...';
            let jsonMetadata = '{}';
            let permlink = 'test';
            let parentPermlink = 'ptest';

            let wif = golos.auth.toWif(author, password, 'posting');
            let keys = await golos_helper.generateKeys(author, password);

            await golos_helper.createAccount(author, keys, cyberfounder, fee);
            await fs_helper.delay(4000);
            await golos_helper.createPost(author, wif, permlink, parentPermlink, title, body , jsonMetadata);
            await fs_helper.delay(4000);
            let content = await golos.api.getContentAsync(author, permlink, 0);        
            
            await assert(content.title == title);
            logger.oklog("After create: title field is valid", {'title' : content.title});
            await assert(content.body == '');
            logger.oklog("After create: body field is valid", {'body' : content.body});
            await assert(content.json_metadata == '');
            logger.oklog("After create: json_metadata field is valid", {'json_metadata' : content.json_metadata});

            logger.oklog("DAVID content", content);

            let cashoutTime = fs_helper.parseUtcString(content.cashout_time);
            let createdTime = fs_helper.parseUtcString(content.created);
            let expectedDeleteContentTime = new Date(createdTime.getTime() + 1250 * 3 * 1000);

            logger.oklog('Times', {'cashoutTime' : cashoutTime, 'createdTime' : createdTime, 'expectedDeleteContentTime' :expectedDeleteContentTime});

            await fs_helper.delay(4000);
            
            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), cashoutTime);
            });

            content = await golos.api.getContentAsync(author, permlink, 0);

            await assert(content.title == title);
            logger.oklog("After cashout content wasn't deleted: title field is non-empty", {'title' : content.title});

            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), expectedDeleteContentTime);
            });

            content = await golos.api.getContentAsync(author, permlink, 0);

            await assert(content.title == '');
            logger.oklog("title field was cleaned right after 65 blocks", {'title' : content.title});

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            logger.oklog("#case4::success");
            return true;
        }
        catch(err) {
            logger.elog("#case4::failed with error", {'err.message' : err.message, 'err' : err});

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            return false;
        }
    },

    // Case5:
    //  lets test when each of three depths * 3 > STEEMIT_CASHOUT_WINDOW_SECONDS`
    //  As #define STEEMIT_CASHOUT_WINDOW_SECONDS          (60*60) /// 1 hour
    //  60*60 == 3600 
    //  comment-title-depth = 1250
    //  comment-body-depth = 1250
    //  comment-json-metadata-depth = 1250 
    allDepthGreaterThanCashout: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case5::begin");

            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setConfig(configData);

            await docker_helper.setBlockLog();
            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon've already started producing blocks
            await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let author = 'elizabeth';
            let password = 'elizabeth123';
            let cyberfounder = 'cyberfounder';
            let fee = '300.000 GOLOS';
            let title = 'Test Elizabeth post title!';
            let body = 'Elizabeth post body...';
            let jsonMetadata = '{}';
            let permlink = 'test';
            let parentPermlink = 'ptest';

            let wif = golos.auth.toWif(author, password, 'posting');
            let keys = await golos_helper.generateKeys(author, password);

            await golos_helper.createAccount(author, keys, cyberfounder, fee);
            await fs_helper.delay(4000);
            await golos_helper.createPost(author, wif, permlink, parentPermlink, title, body , jsonMetadata);
            await fs_helper.delay(4000); 
            let content = await golos.api.getContentAsync(author, permlink, 0);
            
            
            await assert(content.title == title);
            logger.oklog("After create: title field is valid", {'title' : content.title});
            await assert(content.body == body);
            logger.oklog("After create: body field is valid", {'body' : content.body});
            await assert(content.json_metadata == jsonMetadata);
            logger.oklog("After create: json_metadata field is valid", {'json_metadata' : content.json_metadata});

            let cashoutTime = fs_helper.parseUtcString(content.cashout_time);
            let createdTime = fs_helper.parseUtcString(content.created);
            let expectedDeleteContentTime = new Date(createdTime.getTime() + 1250 * 3 * 1000);

            logger.log('Times', {'cashoutTime' : cashoutTime, 'createdTime' : createdTime, 'expectedDeleteContentTime' :expectedDeleteContentTime});        
            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), cashoutTime);
            });

            content = await golos.api.getContentAsync(author, permlink, 0);

            await assert(content.title == title);
            logger.oklog("After cashout content title wasn't deleted: title field is non-empty", {'title' : content.title});
            await assert(content.body == body);
            logger.oklog("After cashout content body wasn't deleted: body field is non-empty", {'body' : content.body});
            await assert(content.json_metadata == jsonMetadata);
            logger.oklog("After cashout content json_metadata wasn't deleted: json_metadata field is non-empty", {'json_metadata' : content.json_metadata});

            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), expectedDeleteContentTime);
            });

            content = await golos.api.getContentAsync(author, permlink, 0);
            logger.log('content after expectedDeleteContentTime', content);
            await assert(content.title == '');
            logger.oklog("After 80 * 3 seconds title was cleaned: title is empty", {'title' : content.title});
            await assert(content.body == '');
            logger.oklog("After 80 * 3 seconds body was cleaned: body is empty", {'body' : content.body});
            await assert(content.json_metadata == '');
            logger.oklog("After 80 * 3 seconds json_metadata was cleaned: json_metadata is empty", {'json_metadata' : content.json_metadata});

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            logger.oklog("#case5::success");

            return true;
        }
        catch(err) {
            logger.elog("#case5::failed with error", err.message);

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            return false;
        }
    },

    // Case6:
    //  One the parameters is bigger than STEEMIT_CASHOUT_WINDOW_SECONDS,
    //  two left are not.
    //  As #define STEEMIT_CASHOUT_WINDOW_SECONDS          (60*60) /// 1 hour
    //  60*60 == 3600 
    //         Set:
    //         comment-title-depth = 1250
    //         comment-body-depth = 1000
    //         comment-json-metadata-depth = 500
    allDepthsDiffer: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case6::begin");

            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setConfig(configData);

            await docker_helper.setBlockLog();
            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon've already started producing blocks
            await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });

            let author = 'fred';
            let password = 'fred123';
            let cyberfounder = 'cyberfounder';
            let fee = '300.000 GOLOS';
            let title = 'Test Fred post title!';
            let body = 'Fred post body...';
            let jsonMetadata = '{}';
            let permlink = 'test';
            let parentPermlink = 'ptest';

            let wif = golos.auth.toWif(author, password, 'posting');
            let keys = await golos_helper.generateKeys(author, password);

            await golos_helper.createAccount(author, keys, cyberfounder, fee);
            await fs_helper.delay(4000);
            await golos_helper.createPost(author, wif, permlink, parentPermlink, title, body , jsonMetadata);
            await fs_helper.delay(4000);
            let content = await golos.api.getContentAsync(author, permlink, 0);
            await fs_helper.delay(4000);
            
            await assert(content.title == title);
            logger.oklog("After create: title field is valid", {'title' : content.title});
            await assert(content.body == body);
            logger.oklog("After create: body field is valid", {'body' : content.body});
            await assert(content.json_metadata == jsonMetadata);
            logger.oklog("After create: json_metadata field is valid", {'json_metadata' : content.json_metadata});

            let cashoutTime = fs_helper.parseUtcString(content.cashout_time);
            let createdTime = fs_helper.parseUtcString(content.created);

            // TODO
            let timeOffset = 10 * 1000;
            let expectedDeleteContentTime = new Date(createdTime.getTime() + 80 * 3 * 1250 + timeOffset);

            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), cashoutTime);
            });

            content = await golos.api.getContentAsync(author, permlink, 0);
            logger.log("content", content);

            await assert(content.title == title);
            logger.oklog("After cashout content title wasn't deleted: title field is non-empty", {'title' : content.title});
            await assert(content.body == '');
            logger.oklog("After cashout content body was cleaned: body field is empty", {'body' : content.body});
            await assert(content.json_metadata == '');
            logger.oklog("After cashout content json_metadata was cleaned: json_metadata field is empty", {'json_metadata' : content.json_metadata});

            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), expectedDeleteContentTime);
            });

            content = await golos.api.getContentAsync(author, permlink, 0);

            await assert(content.title == '');
            logger.oklog("After 1250 * 3 seconds title was cleaned: title is empty", {'title' : content.title});
            await assert(content.body == '');
            logger.oklog("After 1250 * 3 seconds body was cleaned earlier: body is empty", {'body' : content.body});
            await assert(content.json_metadata == '');
            logger.oklog("After 1250 * 3 seconds json_metadata was cleaned: json_metadata is empty", {'json_metadata' : content.json_metadata});

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            logger.oklog("#case6::success");
            return true;
        }
        catch(err) {
            logger.elog("#case6::failed with error", err.message);

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            return false;
        }
    },

    // Case7:
    // - Added option `set-content-storing-depth-null-after-update`
    // Lets set all three parameters equal to 1000 and set `set-content-storing-depth-null-after-update = true`
    // And update after 500 blocks to make the expiration time be on 500 + 1000 blocks == 1500 blocks, when
    // the cashout would be on 1200 block

    // comment-title-depth = 1000
    // comment-body-depth = 1000
    // comment-json-metadata-depth = 1000
    // set-content-storing-depth-null-after-update = true

    updateFlag: async (configData) => {
        let containerHash = '';
        try {
            logger.oklog("#case7::begin");
                
            await docker_helper.cleanWitnessNodeDataDir();
            await docker_helper.setConfig(configData);

            await docker_helper.setBlockLog();
            containerHash = await docker_helper.runDockerContainer();

            // Need to wait some time to make sure daemon've already started producing blocks
            await fs_helper.delay(6000);

            await fs_helper.waitConditionChange( async ()=> {
                let hf = await golos.api.getHardforkVersionAsync();
                return parseInt(hf.split('.')[1]) == config.last_hardfork;
            });


            let author = 'james';
            let password = 'james123';
            let cyberfounder = 'cyberfounder';
            let fee = '300.000 GOLOS';
            let title = 'Test James post title!';
            let body = 'James post body...';
            let jsonMetadata = '{}';
            let permlink = 'test';
            let parentPermlink = 'ptest';

            let wif = golos.auth.toWif(author, password, 'posting');
            let keys = await golos_helper.generateKeys(author, password);

            await golos_helper.createAccount(author, keys, cyberfounder, fee);
            await fs_helper.delay(4000);
            await golos_helper.createPost(author, wif, permlink, parentPermlink, title, body , jsonMetadata);
            await fs_helper.delay(4000);
            let content = await golos.api.getContentAsync(author, permlink, 0);
            await fs_helper.delay(4000);
            
            
            await assert(content.title == title);
            logger.oklog("After create: title field is valid", {'title' : content.title});
            await assert(content.body == body);
            logger.oklog("After create: body field is valid", {'body' : content.body});
            await assert(content.json_metadata == jsonMetadata);
            logger.oklog("After create: json_metadata field is valid", {'json_metadata' : content.json_metadata});

            let cashoutTime = fs_helper.parseUtcString(content.cashout_time);
            let createdTime = fs_helper.parseUtcString(content.created);
            let timeOffset = 10 * 1000;
            let timeBeforeUpdate = new Date(createdTime.getTime() + 500 * 3 * 1000 + timeOffset);
            let expectedDeleteContentTime = new Date(cashoutTime.getTime() + 500 * 3 * 1000 + timeOffset);

            logger.log('Times', {'timeBeforeUpdate' : timeBeforeUpdate, 'cashoutTime' : cashoutTime, 'createdTime' : createdTime, 'expectedDeleteContentTime' :expectedDeleteContentTime});

            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), timeBeforeUpdate);
            });

            body = 'James UPDATED post body...';
            await golos_helper.createPost(author, wif, permlink, parentPermlink, title, body , jsonMetadata);
            logger.oklog('updated James post content', {});

            await fs_helper.waitConditionChange(()=> {
                return fs_helper.compareDates(Date.now(), cashoutTime);
            });

            content = await golos.api.getContentAsync(author, permlink, 0);

            logger.oklog('James content', content);

            await assert(content.title == title);
            logger.oklog("After cashout content title wasn't deleted: title field is non-empty", {'title' : content.title});
            await assert(content.body == body);
            logger.oklog("After cashout content body wasn't cleaned: body field is empty", {'body' : content.body});
            await assert(content.json_metadata == jsonMetadata);
            logger.oklog("After cashout content json_metadata wasn't cleaned: json_metadata field is empty", {'json_metadata' : content.json_metadata});

            await fs_helper.waitConditionChange( ()=> {
                return fs_helper.compareDates(Date.now(), expectedDeleteContentTime);
            });

            await fs_helper.delay(10000);
            content = await golos.api.getContentAsync(author, permlink, 0);
            logger.oklog('James content', content);


            await assert(content.title == '');
            logger.oklog("After expectedDeleteContentTime title was cleaned: title is empty", {'title' : content.title});
            await assert(content.body == '');
            logger.oklog("After expectedDeleteContentTime body was cleaned: body is empty", {'body' : content.body});
            await assert(content.json_metadata == '');
            logger.oklog("After expectedDeleteContentTime json_metadata was cleaned: json_metadata is empty", {'json_metadata' : content.json_metadata});

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            logger.oklog("#case7::success");

            return true;
        }
        catch(err) {
            logger.elog("#case7::failed with error", err.message);

            await docker_helper.stopDockerContainer(containerHash);
            await docker_helper.rmDockerContainer(containerHash);

            return false;
        }
    }
}

module.exports.Cases = Cases;
