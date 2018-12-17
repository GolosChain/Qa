// 
//
//
//    To test Golos API methods you need to have some data in the blockchain
//    So we need to fill it with all avaliable data variants, like
//    posts, comments, votes, price_feeds, market trades and etc
//
//    So this prefiller has two parts: 
//    - Need Cashout to get data  <-  doing some operations and then waiting for cashout
//                                      That would give us opportunity to test
//                                      the whole life cycle of the blockchain.
//
//    - Others                    <-  These ones do not need to wait for cashout to get needed data 
//
// 


const wrapper        = require("./wrapper");
const logger         = require("./logger");
const config         = require("../config.json");
const fs             = require('fs');
const golos          = require('golos-js');
const golos_helper   = require('./golos_helper');

golos.config.set('websocket', "ws://0.0.0.0:8091");
golos.config.set('address_prefix', "GLS");
golos.config.set('chain_id', "5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679");


const shortterm = async () => { 
    const tags = async () => {
      logger.log('Creating account and content for tags methods tests');
      
      let author1 = 'tags-one'; 
      let author2 = 'tags-two'; 
      let author3 = 'tags-three'; 
      await actors(author1, author2, author3);

      let wifTest = golos.auth.toWif(author1, author1, 'posting');
      let permlink = author1;
      let parentPermlink = 'p' + author1;
      await golos_helper.createPost(author1, wifTest, permlink, parentPermlink, author1 + ' test title', author1 + 'test body', '{\"tags\":[\"tag1\",\"tag2\"],\"language\":\"RU\"}');
      await wrapper.delay(3000);

      
      wifTest = golos.auth.toWif(author2, author2, 'posting');
      permlink = author2;
      parentPermlink = 'p' + author2;
      await golos_helper.createPost(author2, wifTest, permlink, parentPermlink, author2 + ' test title', author2 + 'test body', '{\"tags\":[\"tag2\"],\"language\":\"EN\"}');
      await wrapper.delay(3000);

      
      wifTest = golos.auth.toWif(author3, author3, 'posting');
      permlink = author3;
      parentPermlink = 'p' + author3;
      await golos_helper.createPost(author3, wifTest, permlink, parentPermlink, author3 + ' test title', author3 + 'test body', '{\"tags\":[\"tag1\",\"tag3\", \"tag4\"],\"language\":\"FR\"}');
      await wrapper.delay(3000);
    };

    let cyberfounder = 'cyberfounder';
    let cyberfounderKey = config.golosdProperties.cyberfounderKey;
    let fee = '3.000 GOLOS';

    logger.log('Creating test');
    let authorTest = 'test';
    let passwordTest = 'test';
    let wifTest = golos.auth.toWif(authorTest, passwordTest, 'posting');
    let wifTestActive = golos.auth.toWif(authorTest, passwordTest, 'active');
    let keysTest = await golos_helper.generateKeys(authorTest, passwordTest);
    await golos_helper.createAccount(authorTest, keysTest, cyberfounder, fee);
    await wrapper.delay(3000);
    let cli_cmd_transfer  = "set_password 1qaz && unlock 1qaz && transfer cyberfounder test \\\"300.000 GOLOS\\\" \\\"{}\\\" true";
    await wrapper.runCliWalletScript(cli_cmd_transfer);

    logger.log('Creating test comment');
    let permlink = 'test';
    let parentPermlink = 'ptest';
    let title = 'test title';
    let body = 'test body...';
    let jsonMetadata = '{}';
    await golos_helper.createPost('test', wifTest, permlink, parentPermlink, title, body, jsonMetadata);
    await wrapper.delay(3000);

    logger.log('Set vesting withdraw route');
    await golos.broadcast.setWithdrawVestingRouteAsync(wifTestActive, "test", "cyberfounder", 10000, false);
    await wrapper.delay(3000);

    logger.log('Voting for witness');
    await golos.broadcast.accountWitnessVoteAsync(wifTestActive, "test", "cyberfounder", true);
    await wrapper.delay(3000);
    // await escrow();
    logger.log('Updating account');
    let keysTestUpdate = await golos_helper.generateKeys(authorTest, passwordTest + 'update');
    let owner = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[keysTestUpdate.owner, 1]]
    };
    let active = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[keysTestUpdate.active, 1]]
    };
    let posting = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[keysTestUpdate.posting, 1]]
    };
    let memoKey = keysTestUpdate.memo;
    await golos.broadcast.accountUpdate(wifTestActive, 'test', owner, active, posting, memoKey, jsonMetadata);
    await wrapper.delay(3000);

    logger.log('Requesting recovery');
    let newOwner = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[(await golos_helper.generateKeys(authorTest, passwordTest + 'recover')).owner, 1]]
    };
    await golos.broadcast.requestAccountRecoveryAsync(cyberfounderKey, 'cyberfounder', authorTest, newOwner, []);
    await wrapper.delay(3000);

    await tags();
    await socialNetwork();
    await follow();
    await escrow();
    await marketHistory();
};


const longterm = async () => {

  await giveGBGtoCyberfounder();
  await tagsBeforeCahsout();
};

//* GIVE GBG TO CYBERFOUNDER      BEGIN
  const giveGBGtoCyberfounder = async () => {
    logger.log('Giving cyberfounder GBG tokens');
    let cli_cmd =  
      "set_password 1qaz && unlock 1qaz && import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS\
      update_witness cyberfounder localhost GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {\
      \\\"account_creation_fee\\\":           \\\"1.005 GOLOS\\\", \
      \\\"min_delegation\\\":                 \\\"3.000 GOLOS\\\", \
      \\\"create_account_min_delegation\\\":  \\\"3.000 GOLOS\\\", \
      \\\"create_account_min_golos_fee\\\":   \\\"3.000 GOLOS\\\"} true &&\
      publish_feed cyberfounder {\\\"base\\\": \\\"1.000 GBG\\\", \\\"quote\\\": \\\"1.000 GOLOS\\\"} true && \
      post_comment cyberfounder gbg674 \\\"\\\" gbg \\\"GBG post!\\\" \\\"post...\\\" \\\"{}\\\" true &&\
      vote cyberfounder cyberfounder gbg674 100 true"
    await wrapper.runCliWalletScript(cli_cmd);
  };
//  GIVE GBG TO CYBERFOUNDER      END */

//* TAGS BEFORE CASHOUT           BEGIN
  const tagsBeforeCahsout = async () => {
    logger.log('-- TAGS -- Creating accounts and content for tags methods tests');
    
    let author1 = 'tags-cashed-out1'; 
    let author2 = 'tags-cashed-out2'; 
    let author3 = 'tags-cashed-out3';

    await actors(author1, author2, author3);

    let wifTest = golos.auth.toWif(author1, author1, 'posting');
    let permlink = author1;
    let parentPermlink = 'p' + author1;
    await golos_helper.createPost(author1, wifTest, permlink, parentPermlink, author1 + ' test title', author1 + 'test body', '{\"tags\":[\"old1\",\"old2\"],\"language\":\"RU\"}');
    await wrapper.delay(3000);

    
    wifTest = golos.auth.toWif(author2, author2, 'posting');
    permlink = author2;
    parentPermlink = 'p' + author2;
    await golos_helper.createPost(author2, wifTest, permlink, parentPermlink, author2 + ' test title', author2 + 'test body', '{\"tags\":[\"old2\"],\"language\":\"UA\"}');
    await wrapper.delay(3000);

    
    wifTest = golos.auth.toWif(author3, author3, 'posting');
    permlink = author3;
    parentPermlink = 'p' + author3;
    await golos_helper.createPost(author3, wifTest, permlink, parentPermlink, author3 + ' test title', author3 + 'test body', '{\"tags\":[\"old1\",\"old3\", \"old4\"],\"language\":\"RU\"}');
    await wrapper.delay(3000);
  };
//  TAGS BEFORE CASHOUT           END */ 

//* SOCIAL NETWORK                BEGIN
  const socialNetwork = async () => {
    logger.log('Creating account and content for social_network methods tests');
    
    let actorName = 'get-content-test'; 
    await actor(actorName);

    let wifTest = golos.auth.toWif(actorName, actorName, 'posting');
    let permlink = actorName;
    let parentPermlink = 'p' + actorName;
    await golos_helper.createPost(actorName, wifTest, permlink, parentPermlink, actorName + ' test title', actorName + 'test body', '{}');
    await wrapper.delay(3000);

    logger.log('Creating more accounts');

    let replier1 = 'replier1';
    let replier2 = 'replier2';

    await actors(replier1, replier2);
    
    
    logger.log('--Creating content replies');
    

    wifTest = golos.auth.toWif(replier1, replier1, 'posting');
    permlink = replier1;
    parentPermlink = actorName;
    await golos_helper.createComment(replier1, wifTest, permlink, parentPermlink, replier1 + ' test title', replier1 + 'test body', '{}');

    await wrapper.delay(3000);

    wifTest = golos.auth.toWif(replier2, replier2, 'posting');
    permlink = replier2;
    parentPermlink = actorName;
    await golos_helper.createComment(replier2, wifTest, permlink, parentPermlink, replier2 + ' test title', replier2 + 'test body', '{}');

    await wrapper.delay(3000);

    logger.log('Voting for post');
    await golos.broadcast.voteAsync(wifTest, replier2, actorName, actorName, 10000 );
  };
//  SOCIAL NETWORK                END */

//* ESCROW                        BEGIN
  const escrow = async () => {
    logger.log('Creating escrowagent');
    let authorEA = 'escrowagent';
    let passwordEA = 'escrowagent';
    let keysEA = await golos_helper.generateKeys(authorEA, passwordEA);
    await golos_helper.createAccount(authorEA, keysEA, cyberfounder, fee);
    await wrapper.delay(3000);

    logger.log('Transfering escrow');
    await golos.broadcast.transferAsync(cyberfounderKey, 'cyberfounder', 'test', '10.000 GBG', '');
    await wrapper.delay(3000);
    await golos.broadcast.escrowTransferAsync(wifTestActive, 'test', 'cyberfounder', 'escrowagent', 48760203, '0.001 GBG', '0.001 GOLOS', '0.001 GOLOS',
       '2018-12-01T00:00:00', '2018-12-20T00:00:00', '{}');
    await wrapper.delay(3000);
  };
//  ESCROW                        END */

//* FOLLOW                        BEGIN
  const follow = async () => {
    
    logger.log('Creating accounts for Follow tests');

    let blogger1 = 'blogger1';
    let blogger2 = 'blogger2';
    let subscriber1 = 'subscriber1';
    let subscriber2 = 'subscriber2';

    await actors(
      blogger1,
      blogger2,
      subscriber1,
      subscriber2
    );

    let operations = [];

    operations.push(
      ["custom_json", {
        "required_auths":[],
        "required_posting_auths":["subscriber1"],
        "id":"follow",
        "json":"[\"follow\",{\"follower\":\"subscriber1\",\"following\":\"blogger1\",\"what\":[\"blog\"]}]"}]
    );

    operations.push(
      ["custom_json", {
        "required_auths":[],
        "required_posting_auths":["subscriber2"],
        "id":"follow",
        "json":"[\"follow\",{\"follower\":\"subscriber2\",\"following\":\"blogger1\",\"what\":[\"blog\"]}]"}]
    );

    operations.push(
      ["custom_json", {
        "required_auths":[],
        "required_posting_auths":["blogger1"],
        "id":"follow",
        "json":"[\"follow\",{\"follower\":\"blogger1\",\"following\":\"blogger2\",\"what\":[\"blog\"]}]"}]
    );

    let subscriber_key1 = await golos.auth.toWif(subscriber1, subscriber1, 'posting');
    let subscriber_key2 = await golos.auth.toWif(subscriber2, subscriber2, 'posting');
    let blogger_key1 = await golos.auth.toWif(blogger1, blogger1, 'posting');

    await golos.broadcast.send(
      {
        extensions: [],
        operations
      }, [subscriber_key1, subscriber_key2, blogger_key1], function(err, res) {
        if(err) {
          console.log(err)
        }
        else {
          console.log(res)
        }
    });
    operations = [];
    await wrapper.delay(6000);

    let wifBlogger1= golos.auth.toWif(blogger1, blogger1, 'posting');
    permlink = blogger1;
    parentPermlink = 'p' + blogger1;
    await golos_helper.createPost(blogger1, wifBlogger1, permlink, parentPermlink, blogger1 + ' test title', blogger1 + 'test body', '{}');

    await wrapper.delay(3000);

    let wifBlogger2= golos.auth.toWif(blogger2, blogger2, 'posting');
    permlink = blogger2;
    parentPermlink = 'p' + blogger2;
    await golos_helper.createPost(blogger2, wifBlogger2, permlink, parentPermlink, blogger2 + ' test title', blogger2 + 'test body', '{}');
    await wrapper.delay(3000);


    // REBLOG SECTION BEGIN

    // FISRT CASE WITH NO COMMENT TO REPOST
    const operationJson = {
        account: "subscriber1",
        author: "blogger1",
        permlink: "blogger1",
    };

    operations.push(
      [
        "custom_json", {
          "required_auths":[],
          "required_posting_auths":["subscriber1"],
          "id":"follow",
          "json": JSON.stringify(['reblog', operationJson])
        }
      ]
    );

    await golos.broadcast.send(
      {
        extensions: [],
        operations
      }, [subscriber_key1], function(err, res) {
        if(err) {
          console.log(err)
        }
        else {
          console.log(res)
        }
    });
    await wrapper.delay(6000);


    // REBLOG SECTION END
  };
//  FOLLOW                        END */
    
// EMULATING TRADING ACTIVITY 
//* MARKET HISTORY BEGIN
  const marketHistory = async () => {
    logger.log('Creating accounts for Follow tests');

    const fill_names = (arr, name, count = 0, startIndex = 0) => {
      for (let i = startIndex; i < startIndex + count; i++) {
        arr.push(name + i);
      }
    }

    let sellers = [];
    let buyers = [];

    await fill_names(sellers, "seller", 1);
    await fill_names(buyers, "buyer", 1);

    let all = sellers.slice();
    await all.unshift.apply(all, buyers);

    console.log(JSON.stringify(sellers));
    console.log(JSON.stringify(buyers));
    console.log(JSON.stringify(all));

    for (let i = 0; i < all.length; i++) {
      console.log(all[i]);
      await actors(all[i]);
    }

    let genRandomAssetValue = () => {
      let lp = Math.rand() / 100.0;
      let rp = Math.rand() / 1000.0;

    }

    var wif = "5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS";
    var from = 'cyberfounder';
    var to = 'seller0';
    var amount = '10.000 GOLOS';
    var memo = 'gift';
    await golos.broadcast.transferAsync(wif, from, to, amount, memo);

    await golos.broadcast.transferAsync(wif, from, 'buyer0', '10.000 GBG', memo);
    await wrapper.delay(5 * 1000);
    
    let wif1 = await golos.auth.toWif(sellers[0], sellers[0], 'active');
    let wif2 = await golos.auth.toWif(buyers[0], buyers[0], 'active');

    console.log(wif1, wif2);
    let trx_id = 0;
    for (let i = 0; i < 10; i++) {

    }

    for (let i = 0; i < 10; i++) {
      await golos.broadcast.limitOrderCreateAsync(wif1, sellers[0], trx_id++, "1.000 GOLOS", "1.000 GBG", false, "2019-12-07T21:35:15");
    }

    for (let i = 0; i < 5; i++) {
      await golos.broadcast.limitOrderCreateAsync(wif2, buyers[0], trx_id++, "1.000 GBG", "1.000 GOLOS", false, "2019-12-07T21:35:15");
    }   
  };
//* MARKET HISTORY END

module.exports.longterm = longterm;
module.exports.shortterm = shortterm;
// module.exports.follow = follow;
// module.exports.marketHistory = marketHistory;
// module.exports.debugGiveGBGtoCyberfounder = debugGiveGBGtoCyberfounder;

// HELPERS BEGIN
  const actors = async (...acc_names) => {
    for (let acc_name of acc_names) {
      let cyberfounder = 'cyberfounder';
      let cyberfounderKey = config.golosdProperties.cyberfounderKey;
      let fee = '3.000 GOLOS';

      logger.log('Creating ' + acc_name + ' account');
      let acc_keys = await golos_helper.generateKeys(acc_name, acc_name);
      await golos_helper.createAccount(acc_name, acc_keys, cyberfounder, fee);
      await wrapper.delay(3000);
    }
  };

  const actor = async (...acc_name) => actors(acc_name);
// HELPERS END


// DEBUG BEGIN 
  const cp  = require('child_process');

  const debugRunCliCommand = async (commands, buildName = config.defaultBuildName) => {
    try {
      console.log('BEGIN')
        let command = "/home/anton/code/work/19/golos/programs/cli_wallet/cli_wallet --commands=\"" + commands + "\""

      let done = false;
      let cmd = cp.exec(command, {detached: false});

      cmd.stdout.on('data', function (data) {
        console.log(data.toString('utf8'));
      });

      cmd.stderr.on('data', function (data) {
        console.log(data.toString('utf8'));
      });

      cmd.on('close', () => {
        done = true;
      });

      await wrapper.waitConditionChange( async ()=> {
          return done;
      }, 100);
      console.log('SUCCESS')
    }
    catch(err) {
      logger.elog("Executing cli_wallet script failed with error", err.message);
    }
  };

  const debugGiveGBGtoCyberfounder = async () => {
    logger.log('Giving cyberfounder GBG tokens');
    let cli_cmd =  
      "set_password 1 && unlock 1 && import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS &&\
      update_witness cyberfounder localhost GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {\
      \\\"account_creation_fee\\\":           \\\"1.005 GOLOS\\\", \
      \\\"min_delegation\\\":                 \\\"3.000 GOLOS\\\", \
      \\\"create_account_min_delegation\\\":  \\\"3.000 GOLOS\\\", \
      \\\"create_account_min_golos_fee\\\":   \\\"3.000 GOLOS\\\"} true &&\
      publish_feed cyberfounder {\\\"base\\\": \\\"1.000 GBG\\\", \\\"quote\\\": \\\"1.000 GOLOS\\\"} true && \
      post_comment cyberfounder gbg674 \\\"\\\" gbg \\\"GBG post!\\\" \\\"post...\\\" \\\"{}\\\" true &&\
      vote cyberfounder cyberfounder gbg674 100 true"
    await debugRunCliCommand(cli_cmd);
  };

// DEBUG END