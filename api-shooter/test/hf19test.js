const chai    = require('chai');
const assertArrays = require('chai-arrays');
chai.use(assertArrays);

const should  = chai.should();
const expect  = chai.expect;
const path    = require('path');
const wrapper = require('../src/wrapper');
const config  = require("../config.json");

const rootDir        =    path.resolve(process.cwd() + "/../golos-tests/");
const golos          =    require('golos-js');
const golos_helper   =    require('../src/golos_helper');

describe("924 Account Notes plugin", async function() {
  it("924 Account Notes plugin description", async function() {
    let settings = await golos.api.sendAsync("account_notes", {"method": "get_settings", "params":[]});

    settings.should.have.property('max_key_length');
    settings.max_key_length.should.be.a('number');

    settings.should.have.property('max_value_length');
    settings.max_value_length.should.be.a('number');

    settings.should.have.property('max_note_count');
    settings.max_note_count.should.be.a('number');

    settings.should.have.property('tracked_accounts');
    settings.tracked_accounts.should.be.a('array');

    settings.should.have.property('untracked_accounts');
    settings.untracked_accounts.should.be.a('array');

    let res = await golos.api.sendAsync("account_notes", {"method": "get_value", "params":["test-898","lorem"]});
    res.should.be.a('string');
    res.should.be.equal('');

    let wifTest = golos.auth.toWif('test-898', 'test-898', 'active');
    var json = JSON.stringify(['set_value', {
      account: 'test-898',
      key: 'lorem',
      value: 'ipsum'
    }]);
    res = await golos.broadcast.customJsonAsync(wifTest, ['test-898'], [], 'account_notes', json);
    console.log('set_value result is', res);

    res = await golos.api.sendAsync("account_notes", {"method": "get_value", "params":["test-898","lorem"]});
    console.log(JSON.stringify(res, null, 2));
    res.should.be.a('string');
    res.should.be.equal('ipsum');
  });
});

describe("324 Add option to choose curation reward percent", async function() {
  it("324 Add option to choose curation reward percent description", async function() {
    var cp = await golos.api.getChainProperties();
    cp.should.have.property('min_curation_percent');
    cp.should.have.property('max_curation_percent');

    console.log('-- Checking t324-default post');
    let c = await golos.api.getContentAsync('t324-1', 't324-default', 0);
    c.curation_rewards_percent.should.be.equal(cp.min_curation_percent);
  });
});

describe("898 Auction window improvements", async function() {
  this.timeout(10000);
  it("898 Auction window improvements description", async function() {
    let content = await golos.api.getContent('test-898', 'test-898', -1);
    console.log(content);

    content.should.have.property('auction_window_reward_destination');
    content.should.have.property('auction_window_size');
    content.should.have.property('auction_window_weight');
    content.should.have.property('votes_in_auction_window_weight');

    content.auction_window_reward_destination.should.be.a('string');
    content.auction_window_size.should.be.a('number');
    content.auction_window_weight.should.be.a('number');
    content.votes_in_auction_window_weight.should.be.a('number');

    content.auction_window_reward_destination.should.eql('to_reward_fund');

  // // Preparing operation to change the AUW reward destination
  //   let author = 'test-898';
  //   let permlink = 'test-898';

  //   let operations = [];

  //   let max_accepted_payout = ["1000000.000", 'GBG'].join(" ");
  //   let percent_steem_dollars = 10000; // 10000 === 100%
  //   let allow_votes = true;
  //   let allow_curation_rewards = true;

  //   operations.push(
  //     ['comment_options', {
  //       author,
  //       permlink,
  //       max_accepted_payout,
  //       percent_steem_dollars,
  //       allow_votes,
  //       allow_curation_rewards,
  //       // extensions: [ [ 1, {destination: "to_curators"}] ] // ← Doesn't work! FIXME
  //       // extensions: [ [ 0, { beneficiaries: [{ account: 'golosio', weight: 1000 }] } ] ] // Delete after fix ↑↑
  //     }]
  //   )

  //   let author_key = await golos.auth.toWif('test-898', 'test-898', 'posting');

  //   await golos.broadcast.send(
  //     {
  //       extensions: [],
  //       operations
  //     }, [author_key], function(err, res) {
  //       if(err) {
  //         console.log(err)
  //       }
  //       else {
  //         console.log(res)
  //       }
  //   });
  //   await wrapper.delay(6000);
  // // getting updated comment info
  //   let content1 = await golos.api.getContent('test-898', 'test-898', -1);
  //   console.log("CHECK");
  //   console.log(content1);

// Check changes from 898 issue with cli_wallet.
    let cmd1 =
        "set_password 1qaz && \
        unlock 1qaz && \
        import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS && \
        create_account cyberfounder todelegator \\\"{}\\\" \\\"3.000 GOLOS\\\" true && \
        post_comment todelegator test \\\"\\\" ptest \\\"To Delegator\\\" \\\"To Delegator\\\" \\\"{}\\\" true";

    let cmd21 =
        "unlock 1qaz && \
        begin_builder_transaction";

    let cmd22 =
        "unlock 1qaz && \
        add_operation_to_builder_transaction 0 [ \\\"comment_options\\\", { \\\"author\\\": \\\"todelegator\\\", \\\"permlink\\\": \\\"test\\\", \\\"max_accepted_payout\\\": \\\"1000000.000 GBG\\\", \\\"percent_steem_dollars\\\": 10000, \\\"allow_votes\\\": true, \\\"allow_curation_rewards\\\": true, \\\"extensions\\\": [ [ 1, { \\\"destination\\\": \\\"to_curators\\\" } ] ] } ]";

    let cmd23 =
        "unlock 1qaz && \
        sign_builder_transaction 0 true";

    console.log("Running 1 >>")
    await wrapper.runCliWalletScript(cmd1);
    console.log("Running 2 >>")
    await wrapper.runCliWalletScript(cmd21);
    await wrapper.runCliWalletScript(cmd22);
    await wrapper.runCliWalletScript(cmd23);

    let commentObj1 = await golos.api.getContentAsync("todelegator","test", -1);
    console.log("Changed object >> ")
    console.log(commentObj1);
    commentObj1.auction_window_reward_destination.should.eql('to_curators');


    let cmd31 =
      "unlock 1qaz && \
       begin_builder_transaction"

    let cmd32 =
      "unlock 1qaz && \
       add_operation_to_builder_transaction 1 [ \\\"comment_options\\\", { \\\"author\\\": \\\"todelegator\\\", \\\"permlink\\\": \\\"test\\\", \\\"max_accepted_payout\\\": \\\"1000000.000 GBG\\\", \\\"percent_steem_dollars\\\": 10000, \\\"allow_votes\\\": true, \\\"allow_curation_rewards\\\": true, \\\"extensions\\\": [ [ 1, { \\\"destination\\\": \\\"to_reward_fund\\\" } ] ] } ]"

    let cmd33 =
      "unlock 1qaz && \
       sign_builder_transaction 1 true"

    console.log("Running 3 >>")
    await wrapper.runCliWalletScript(cmd31);
    await wrapper.runCliWalletScript(cmd32);
    await wrapper.runCliWalletScript(cmd33);

    console.log("Getting content 2 >> ")
    let commentObj2 = await golos.api.getContentAsync("todelegator","test1", -1);

    console.log(commentObj2);
    commentObj2.auction_window_reward_destination.should.eql('to_reward_fund');

  }).timeout(10 * 1000);
});

describe("533 Reduce time limits for posting and voting", async function() {
  this.timeout(0);
  it("533 Reduce time limits for posting and voting description", async function() {
    await actors('test-533');

    var cp = await golos.api.getChainProperties();
    cp.should.have.property('comments_window');
    cp.should.have.property('comments_per_window');
    cp.should.have.property('votes_window');
    cp.should.have.property('votes_per_window');

    console.log('-- Creating test-533-comment-0');
    let wifTest = golos.auth.toWif('test-533', 'test-533', 'posting');
    let permlink = 'test-533-comment-0';
    let parentPermlink = 'ptest';
    await golos_helper.createPost('test-533', wifTest, permlink, parentPermlink, 'test title', 'test body', '{}');
    await wrapper.delay(6000);

    for (let i = 1; i <= cp.comments_per_window - 1; ++i) { 
      console.log('-- Creating test-533-comment-' + i);
      permlink = 'test-533-comment-' + i;
      await golos_helper.createComment('test-533', wifTest, permlink, 'test-533', 'test-533-comment-0', 'test title', 'test body', '{}');
      await wrapper.delay(1000);
    }

    console.log('-- Trying to create last comment (should fail)');
    permlink = 'test-533-comment-' + cp.comments_per_window;
    try {
      await golos_helper.createComment('test-533', wifTest, permlink, 'test-533', 'test-533-comment-0', 'test title', 'test body', '{}');
      assert(false, 'Exception must throw because limit was exceed');
    } catch (e) {
    }

    console.log('-- It fails. Waiting (skipping 1 window)');
    await wrapper.delay(cp.comments_window*1000);

    console.log('-- Trying again');
    try {
      await golos_helper.createComment('test-533', wifTest, permlink, 'test-533', 'test-533-comment-0', 'test title', 'test body', '{}');
    } catch (e) {
      assert(false, 'Exception must not throw because limit was renewed');
    }
    console.log('-- Success now');
  });
});

describe("295 Referral program", async () => {
  it("295 Referral program description", async () => {
    var accs = await golos.api.getAccounts(['test-295-refl-1', 'test-295-refl-2', 'test-295-refl-3']);

    console.log('-- Checking test-295-refl-1 account (breaked via referral end)');
    accs[0].should.have.property('referrer_account');
    accs[0].referrer_account.should.be.a('string');
    accs[0].should.have.property('referrer_interest_rate');
    accs[0].referrer_interest_rate.should.be.a('number');
    accs[0].referrer_interest_rate.should.be.equal(0);
    accs[0].should.have.property('referral_end_date');
    accs[0].referral_end_date.should.be.a('string');
    accs[0].should.have.property('referral_break_fee');
    accs[0].referral_break_fee.should.be.a('string');

    console.log('-- Checking test-295-refl-2 account (breaked via referral break free)');
    accs[1].should.have.property('referrer_account');
    accs[1].referrer_account.should.be.a('string');
    accs[1].should.have.property('referrer_interest_rate');
    accs[1].referrer_interest_rate.should.be.a('number');
    accs[1].referrer_interest_rate.should.be.equal(0);
    accs[1].should.have.property('referral_end_date');
    accs[1].referral_end_date.should.be.a('string');
    accs[1].should.have.property('referral_break_fee');
    accs[1].referral_break_fee.should.be.a('string');

    console.log('-- Checking test-295-refl-1 account (not breaked)');
    accs[2].should.have.property('referrer_account');
    accs[2].referrer_account.should.be.a('string');
    accs[2].should.have.property('referrer_interest_rate');
    accs[2].referrer_interest_rate.should.be.a('number');
    accs[2].referrer_interest_rate.should.be.not.equal(0);
    accs[2].should.have.property('referral_end_date');
    accs[2].referral_end_date.should.be.a('string');
    accs[2].should.have.property('referral_break_fee');
    accs[2].referral_break_fee.should.be.a('string');

    console.log('-- Checking test-295-1 comment (when referral not yet ended)');
    let content = await golos.api.getContent('test-295-refl-1', 'test-295-1', 0);
    content.beneficiaries.should.have.length(1);
    content.beneficiaries[0].account.should.be.equal('test-295-0');
    content.beneficiaries[0].weight.should.be.equal(900);

    console.log('-- Checking test-295-2 comment (when referral not yet ended)');
    content = await golos.api.getContent('test-295-refl-1', 'test-295-2', 0);
    content.beneficiaries.should.have.length(0);
  });
});

describe("825 post_count & comment_count Fix", async () => {
  it("825 post_count & comment_count Fix description", async () => {
    var accs = await golos.api.getAccounts(['test-825-1', 'test-825-2', 'test-825-3']);

    accs[0].should.have.property('post_count');
    accs[0].post_count.should.be.a('number');
    accs[0].post_count.should.be.equal(1);
    accs[0].should.have.property('comment_count');
    accs[0].comment_count.should.be.a('number');
    accs[0].comment_count.should.be.equal(0);

    accs[1].should.have.property('post_count');
    accs[1].post_count.should.be.a('number');
    accs[1].post_count.should.be.equal(0);
    accs[1].should.have.property('comment_count');
    accs[1].comment_count.should.be.a('number');
    accs[1].comment_count.should.be.equal(1);

    accs[2].should.have.property('post_count');
    accs[2].post_count.should.be.a('number');
    accs[2].post_count.should.be.equal(0);
    accs[2].should.have.property('comment_count');
    accs[2].comment_count.should.be.a('number');
    accs[2].comment_count.should.be.equal(0);
  });
});

describe("756 Set percent for delegated Golos Power", async function() {
  this.timeout(0);
  it("756 Set percent for delegated Golos Power description", async function () {
    await actors('test-756-dr', 'test-756-de');

    let OPERATIONS = [];

    OPERATIONS.push(
      ['delegate_vesting_shares_with_interest',
        {
          delegator: 'test-756-dr',
          delegatee: 'test-756-de',
          vesting_shares: '50000.000000 GESTS',
          interest_rate: 25*100,
          payout_strategy: 'to_delegated_vesting'
        }
      ]
    );
    await golos_helper.broadcastOperations(OPERATIONS);
    await wrapper.delay(6*1000);

    let res = await golos.api.sendAsync('database_api', {'method': 'get_vesting_delegations', 'params':['test-756-dr', 'test-756-de', 1]});
    res.should.have.length.above(0);
    res[0].interest_rate.should.be.equal(25*100);
  });
});


const checkPrice = (asset) => {
  asset.should.be.an('object');
  asset.should.have.property('base');
  asset.should.have.property('quote');
}

const checkWitness = async (witness) => {
  witness.should.have.property('id');
  witness.id.should.be.a('number');

  witness.should.have.property('owner');
  witness.owner.should.be.a('string');

  witness.should.have.property('created');
  witness.created.should.be.a('string');

  witness.should.have.property('url');
  witness.url.should.be.a('string');

  witness.should.have.property('votes');
  witness.votes.should.satisfy((val) => {
    return typeof(val) === 'string' || val === 0;
  });

  witness.should.have.property('virtual_last_update');
  witness.virtual_last_update.should.be.a('string');

  witness.should.have.property('virtual_position');
  witness.virtual_position.should.be.a('string');

  witness.should.have.property('virtual_scheduled_time');
  witness.virtual_scheduled_time.should.be.a('string');

  witness.should.have.property('total_missed');
  witness.total_missed.should.be.a('number');

  witness.should.have.property('last_aslot');
  witness.last_aslot.should.be.a('number');

  witness.should.have.property('last_confirmed_block_num');
  witness.last_confirmed_block_num.should.be.a('number');

  witness.should.have.property('pow_worker');
  witness.pow_worker.should.be.a('number');

  witness.should.have.property('signing_key');
  witness.signing_key.should.be.a('string');

  witness.should.have.property('props');
  witness.props.should.be.an('object');

  witness.props.should.have.property('account_creation_fee');
  witness.props.should.have.property('maximum_block_size');
  witness.props.should.have.property('sbd_interest_rate');
  witness.props.should.have.property('create_account_min_golos_fee');
  witness.props.should.have.property('create_account_min_delegation');
  witness.props.should.have.property('create_account_delegation_time');
  witness.props.should.have.property('min_delegation');

  witness.props.account_creation_fee.should.be.a('string');
  witness.props.maximum_block_size.should.be.a('number');
  witness.props.sbd_interest_rate.should.be.a('number');
  witness.props.create_account_min_golos_fee.should.be.a('string');
  witness.props.create_account_min_delegation.should.be.a('string');
  witness.props.create_account_delegation_time.should.be.a('number');
  witness.props.min_delegation.should.be.a('string');

  witness.should.have.property('sbd_exchange_rate');
  checkPrice(witness.sbd_exchange_rate);

  witness.should.have.property('last_sbd_exchange_update');
  witness.last_sbd_exchange_update.should.be.a('string');

  witness.should.have.property('last_work');
  witness.last_work.should.be.a('string');

  witness.should.have.property('running_version');
  witness.running_version.should.be.a('string');

  witness.should.have.property('hardfork_version_vote');
  witness.hardfork_version_vote.should.be.a('string');

  witness.should.have.property('hardfork_time_vote');
  witness.hardfork_time_vote.should.be.a('string');
};

const checkArray = (arr, callback) => {
  arr.should.be.a('array');
  let len = arr.length;

  for (let i = 0; i < len; i++) {
    callback(arr[i]);
  } 
};

const checkOperation = (o) => {
  o.should.be.a('object');

  o.should.have.property('trx_id');
  o.should.have.property('block');
  o.should.have.property('trx_in_block');
  o.should.have.property('op_in_trx');
  o.should.have.property('virtual_op');
  o.should.have.property('timestamp');
  o.should.have.property('op');


  o.trx_id.should.be.a('string');
  o.block.should.be.a('number');
  o.trx_in_block.should.be.a('number');
  o.op_in_trx.should.be.a('number');
  o.virtual_op.should.be.a('number');
  o.timestamp.should.be.a('string');
  o.op.should.be.a('array');
};


const actors = async (...acc_names) => {
  for (let acc_name of acc_names) {
    let cyberfounder = 'cyberfounder';
    let cyberfounderKey = config.golosdProperties.cyberfounderKey;
    let fee = '3.000 GOLOS';

    console.log('---- Creating ' + acc_name + ' account');
    let acc_keys = await golos_helper.generateKeys(acc_name, acc_name);
    await golos_helper.createAccount(acc_name, acc_keys, cyberfounder, fee);
    await wrapper.delay(6000);
  }
};

const actor = async (...acc_name) => actors(acc_name);
