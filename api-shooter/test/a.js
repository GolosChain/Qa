const chai    = require('chai');
const assertArrays = require('chai-arrays');
chai.use(assertArrays);

const should  = chai.should();
const expect  = chai.expect;
const path    = require('path');

const rootDir = path.resolve(process.cwd() + "/../golos-tests/");
const golos   = require('golos-js');

golos.config.set('websocket', "ws://0.0.0.0:8091");
golos.config.set('address_prefix', "GLS");
golos.config.set('chain_id', "5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679");

/* WITNESS API BEGIN
  describe("witness_api::get_current_median_history_price", async () => {
    it("witness_api::get_current_median_history_price", async () => {
      let res = await golos.api.getCurrentMedianHistoryPriceAsync();
      checkPrice(res);
    });
  });

  describe("witness_api::get_feed_history", async () => {
    it("witness_api::get_feed_history", async () => {
      let res = await golos.api.getFeedHistoryAsync();
      res.should.be.an('object');
      res.should.have.property('id');
      res.should.have.property('current_median_history');

      res.id.should.satisfy(isNumber);
      checkPrice(res.current_median_history);

      res.price_history.should.be.an('array');
      let len = res.price_history.length;
      for (let i = 0; i < len; i++) {
        checkPrice(res.price_history[i]) 
      }
    });
  });

  describe("witness_api::get_miner_queue", async () => {
    it("witness_api::get_miner_queue", async () => {
      let res = await golos.api.getMinerQueueAsync();
      // console.log(res);
      res.should.be.an('array');
      res.length.should.satisfy( (len) => {
        return len > 0;
      });
    });
  });

  describe("witness_api::get_witness_schedule", async () => {
    it("witness_api::get_witness_schedule", async () => {
      let res = await golos.api.getWitnessScheduleAsync();
      res.should.have.property('id');
      res.id.should.satisfy(isNumber);

      res.should.have.property('current_virtual_time');
      res.current_virtual_time.should.be.a('string');

      res.should.have.property('next_shuffle_block_num');
      res.next_shuffle_block_num.should.satisfy(isNumber);

      res.should.have.property('current_shuffled_witnesses');
      res.current_shuffled_witnesses.should.be.a('string');

      res.should.have.property('num_scheduled_witnesses');
      res.num_scheduled_witnesses.should.satisfy(isNumber);

      res.should.have.property('top19_weight');
      res.top19_weight.should.satisfy(isNumber);

      res.should.have.property('timeshare_weight');
      res.timeshare_weight.should.satisfy(isNumber);

      res.should.have.property('miner_weight');
      res.miner_weight.should.satisfy(isNumber);

      res.should.have.property('witness_pay_normalization_factor');
      res.witness_pay_normalization_factor.should.satisfy(isNumber);

      res.should.have.property('median_props');
      res.median_props.should.be.a('object');

      res.should.have.property('median_props');
      res.median_props.should.be.a('object');

      res.median_props.should.have.property('account_creation_fee');
      res.median_props.should.have.property('maximum_block_size');
      res.median_props.should.have.property('sbd_interest_rate');
      res.median_props.should.have.property('create_account_min_golos_fee');
      res.median_props.should.have.property('create_account_min_delegation');
      res.median_props.should.have.property('create_account_delegation_time');
      res.median_props.should.have.property('min_delegation');

      res.median_props.account_creation_fee.should.be.a('string');
      res.median_props.maximum_block_size.should.satisfy(isNumber);
      res.median_props.sbd_interest_rate.should.satisfy(isNumber);
      res.median_props.create_account_min_golos_fee.should.be.a('string');
      res.median_props.create_account_min_delegation.should.be.a('string');
      res.median_props.create_account_delegation_time.should.satisfy(isNumber);
      res.median_props.min_delegation.should.be.a('string');


      res.should.have.property('majority_version');
      res.majority_version.should.be.a('string');
    });
  });

  describe("witness_api::get_witnesses", async () => {
    it("witness_api::get_witnesses", async () => {
      let res = await golos.api.getWitnessesAsync([4, 8, 15, 16, 23, 42]);
      console.log(res);
      res.forEach((val) => {
        checkWitness(val);
      });
    });
  });

  describe("witness_api::get_witness_by_account", async () => {
    it("witness_api::get_witness_by_account", async () => {
      let res = await golos.api.getWitnessByAccountAsync('cyberfounder');
      checkWitness(res);
    });
  });

  describe("witness_api::get_witnesses_by_vote", async () => {
    it("witness_api::get_witnesses_by_vote", async () => {
      let res = await golos.api.getWitnessesByVoteAsync('cyberfounder', 100);
      console.log(res);
      res.should.be.a('array');

      res[0].should.have.property('id');
      res[0].should.have.property('owner');
      res[0].should.have.property('created');
      res[0].should.have.property('url');
      res[0].should.have.property('votes');
      res[0].should.have.property('virtual_last_update');
      res[0].should.have.property('virtual_position');
      res[0].should.have.property('virtual_scheduled_time');
      res[0].should.have.property('total_missed');
      res[0].should.have.property('last_aslot');
      res[0].should.have.property('last_confirmed_block_num');
      res[0].should.have.property('pow_worker');
      res[0].should.have.property('signing_key');

      res[0].id.should.satisfy(isNumber);
      res[0].owner.should.be.a('string');
      res[0].created.should.be.a('string');
      res[0].url.should.be.a('string');
      res[0].votes.should.be.a('string');
      res[0].virtual_last_update.should.be.a('string');
      res[0].virtual_position.should.be.a('string');
      res[0].virtual_scheduled_time.should.be.a('string');
      res[0].total_missed.should.satisfy(isNumber);
      res[0].last_aslot.should.satisfy(isNumber);
      res[0].last_confirmed_block_num.should.satisfy(isNumber);
      res[0].pow_worker.should.satisfy(isNumber);
      res[0].signing_key.should.be.a('string');

      res[0].should.have.property('props');
      res[0].props.should.be.a('object');

      res[0].props.should.have.property('account_creation_fee');
      res[0].props.should.have.property('maximum_block_size');
      res[0].props.should.have.property('sbd_interest_rate');
      res[0].props.should.have.property('create_account_min_golos_fee');
      res[0].props.should.have.property('create_account_min_delegation');
      res[0].props.should.have.property('create_account_delegation_time');
      res[0].props.should.have.property('min_delegation');
      res[0].props.should.have.property('max_referral_interest_rate');
      res[0].props.should.have.property('max_referral_term_sec');
      res[0].props.should.have.property('max_referral_break_fee');
      res[0].props.should.have.property('comments_window');
      res[0].props.should.have.property('comments_per_window');
      res[0].props.should.have.property('votes_window');
      res[0].props.should.have.property('votes_per_window');
      res[0].props.should.have.property('auction_window_size');
      res[0].props.should.have.property('max_delegated_vesting_interest_rate');
      res[0].props.should.have.property('custom_ops_bandwidth_multiplier');
      res[0].props.should.have.property('min_curation_percent');
      res[0].props.should.have.property('max_curation_percent');

      res[0].props.account_creation_fee.should.be.a('string');
      res[0].props.maximum_block_size.should.satisfy(isNumber);
      res[0].props.sbd_interest_rate.should.satisfy(isNumber);
      res[0].props.create_account_min_golos_fee.should.be.a('string');
      res[0].props.create_account_min_delegation.should.be.a('string');
      res[0].props.create_account_delegation_time.should.satisfy(isNumber);
      res[0].props.min_delegation.should.be.a('string');
      res[0].props.max_referral_interest_rate.should.satisfy(isNumber);
      res[0].props.max_referral_term_sec.should.satisfy(isNumber);
      res[0].props.max_referral_break_fee.should.be.a('string');
      res[0].props.comments_window.should.satisfy(isNumber);
      res[0].props.comments_per_window.should.satisfy(isNumber);
      res[0].props.votes_window.should.satisfy(isNumber);
      res[0].props.votes_per_window.should.satisfy(isNumber);
      res[0].props.auction_window_size.should.satisfy(isNumber);
      res[0].props.max_delegated_vesting_interest_rate.should.satisfy(isNumber);
      res[0].props.custom_ops_bandwidth_multiplier.should.satisfy(isNumber);
      res[0].props.min_curation_percent.should.satisfy(isNumber);
      res[0].props.max_curation_percent.should.satisfy(isNumber);

      res[0].should.have.property('sbd_exchange_rate');
      res[0].sbd_exchange_rate.should.be.a('object');
      checkPrice(res[0].sbd_exchange_rate)

      res[0].should.have.property('last_sbd_exchange_update');
      res[0].should.have.property('last_work');
      res[0].should.have.property('running_version');
      res[0].should.have.property('hardfork_version_vote');
      res[0].should.have.property('hardfork_time_vote');

      res[0].last_sbd_exchange_update.should.be.a('string');
      res[0].last_work.should.be.a('string');
      res[0].running_version.should.be.a('string');
      res[0].hardfork_version_vote.should.be.a('string');
      res[0].hardfork_time_vote.should.be.a('string');
    });
  });

  describe("witness_api::get_witness_count", async () => {
    it("witness_api::get_witness_count", async () => {
      let res = await golos.api.getWitnessCount();
      res.should.satisfy(isNumber);
    });
  });

  describe("witness_api::lookup_witness_accounts", async () => {
    it("witness_api::lookup_witness_accounts", async () => {
      let res = await golos.api.lookupWitnessAccounts('cyberfounder', 100);
      res.forEach((val) => {
        val.should.be.a('string');
      });
    });
  });

  describe("witness_api::get_active_witnesses", async () => {
    it("witness_api::get_active_witnesses", async () => {
      let res = await golos.api.getActiveWitnesses();
        res.forEach((val) => {
        val.should.be.a('string');
      });
    });
  });
// WITNESS API END */

/* ACCOUNT HISTORY BEGIN
  describe("account_history::get_account_history", async () => {
    it("account_history::get_account_history", async () => {
      let res = await golos.api.getAccountHistory('cyberfounder');

      res.forEach( (pair) => {
        pair[0].should.satisfy(isNumber);
        checkOperation(pair[1]);
      })
    });
});
// ACCOUNT HISTORY END */

/* OPERATION HISTORY BEGIN
  describe("operation_history::get_ops_in_block", async () => {
    it("operation_history::get_ops_in_block", async () => {
      let res = await golos.api.getOpsInBlock(200);

      res.forEach((o) => {
        checkOperation(o);
      })
    });
  });

  describe("operation_history::get_transaction", async () => {
    it("operation_history::get_transaction", async () => {
      let res = await golos.api.getTransaction('d233796e0c6512fbef1fd00b9d829f98746b28e5');

      res.should.have.property('ref_block_num');
      res.should.have.property('ref_block_prefix');
      res.should.have.property('expiration');
      res.should.have.property('operations');
      res.should.have.property('extensions');
      res.should.have.property('signatures');
      res.should.have.property('transaction_id');
      res.should.have.property('block_num');
      res.should.have.property('transaction_num');

      res.ref_block_num.should.satisfy(isNumber);
      res.ref_block_prefix.should.satisfy(isNumber);
      res.expiration.should.be.a('string');
      res.operations.should.be.a('array');
      res.extensions.should.be.a('array');
      res.signatures.should.be.a('array');
      res.transaction_id.should.be.a('string');
      res.block_num.should.satisfy(isNumber);
      res.transaction_num.should.satisfy(isNumber);
    });
  });
//  OPERATION HISTORY END */

/* TAGS BEGIN
  describe("tags::get_trending_tags", async () => { // TODO
    it("tags::get_trending_tags", async () => {
      let tags = "tag1";
      let res = await golos.api.getTrendingTagsAsync(tags, 10);

      res.forEach((val) => {
        val.should.be.a('object');

        val.should.have.property('name');
        val.should.have.property('total_children_rshares2');
        val.should.have.property('total_payouts');
        val.should.have.property('net_votes');
        val.should.have.property('top_posts');
        val.should.have.property('comments');

        val.name.should.be.a('string');
        val.total_children_rshares2.should.be.a('string');
        val.total_payouts.should.be.a('string');
        val.net_votes.should.be.a('number');
        val.top_posts.should.be.a('number');
        val.comments.should.be.a('number');
      });
    });
  });

  describe("tags::get_tags_used_by_author", async () => {
    it("tags::get_tags_used_by_author", async () => {
      let author1 = 'tags-one';
      let res = await golos.api.getTagsUsedByAuthorAsync(author1);
      console.log(res);

      res.should.be.a('array');
      await res.forEach((val) => {
        val.should.be.a('array');
        val[0].should.be.a('string');
        val[1].should.be.a('number');
      });

    });

  });

  describe("tags::get_discussions_by_payout", async () => {
    it("tags::get_discussions_by_payout", async () => {
      let query = {
        start_author: 'tags-three',
        start_permlink: 'tags-three'
      };

      let res = await golos.api.getDiscussionsByPayoutAsync(query);
      console.log(res);

    });

  });

  describe("tags::get_discussions_by_trending", async () => {
    it("tags::get_discussions_by_trending", async () => {
      let query = {
        start_author: 'tags-three',
        start_permlink: 'tags-three'
      };

      let res = await golos.api.getDiscussionsByTrendingAsync(query);
      console.log(res);
    });

  });

  describe("tags::get_discussions_by_created", async () => {
    it("tags::get_discussions_by_created", async () => {
      let query = {
        start_author: 'tags-three',
        start_permlink: 'tags-three'
      };

      let res = await golos.api.getDiscussionsByCreatedAsync(query);
      console.log(res);
    });

  });

  describe("tags::get_discussions_by_active", async () => {
    it("tags::get_discussions_by_active", async () => {
      let query = {
        start_author: 'tags-three',
        start_permlink: 'tags-three'
      };

      let res = await golos.api.getDiscussionsByActiveAsync(query);
      console.log(res);
    });
  });

  describe("tags::get_discussions_by_cashout", async () => {
    it("tags::get_discussions_by_cashout", async () => {
      let query = {
        start_author: 'tags-three',
        start_permlink: 'tags-three'
      };

      let res = await golos.api.getDiscussionsByCashoutAsync(query);
      console.log(res);
    });
  });

  describe("tags::get_discussions_by_votes", async () => {
    it("tags::get_discussions_by_votes", async () => {
      let query = {
        start_author: 'tags-three',
        start_permlink: 'tags-three'
      };

      let res = await golos.api.getDiscussionsByVotesAsync(query);
      console.log(res);
    });
  });

  describe("tags::get_discussions_by_children", async () => {
    it("tags::get_discussions_by_children", async () => {
      let query = {
        start_author: 'tags-three',
        start_permlink: 'tags-three'
      };

      let res = await golos.api.getDiscussionsByChildrenAsync(query);
      console.log(res);
    });

  });

  describe("tags::get_discussions_by_hot", async () => {
    it("tags::get_discussions_by_hot", async () => {
      let query = {
        start_author: 'tags-three',
        start_permlink: 'tags-three'
      };

      let res = await golos.api.getDiscussionsByHotAsync(query);
      console.log(res);
    });
  });

  describe("tags::get_discussions_by_feed", async () => {
    it("tags::get_discussions_by_feed", async () => {
      let query = {
        start_author: 'tags-three',
        start_permlink: 'tags-three'
      };

      let res = await golos.api.getDiscussionsByFeedAsync(query);
      console.log(res);
    });
  });

  describe("tags::get_discussions_by_blog", async () => {
    it("tags::get_discussions_by_blog", async () => {
      let query = {
        start_author: 'tags-three',
        start_permlink: 'tags-three'
      };

      let res = await golos.api.getDiscussionsByBlogAsync(query);
      console.log(res);
    });
  });

  describe("tags::get_discussions_by_comments", async () => {
    it("tags::get_discussions_by_comments", async () => {
      let query = {
        start_author: 'tags-three',
        start_permlink: 'tags-three'
      };

      let res = await golos.api.getDiscussionsByCommentsAsync(query);
      console.log(res);
    });
  });

  describe("tags::get_discussions_by_promoted", async () => {
    it("tags::get_discussions_by_promoted", async () => {
      let query = {
        start_author: 'tags-three',
        start_permlink: 'tags-three'
      };

      let res = await golos.api.getDiscussionsByPromotedAsync(query);
      console.log(res);
    });
  });

  describe("tags::get_discussions_by_author_before_date", async () => {
    it("tags::get_discussions_by_author_before_date", async () => {
      let query = {
        start_author: 'tags-three',
        start_permlink: 'tags-three'
      };

      let res = await golos.api.getDiscussionsByAuthorBeforeDateAsync(query);
      console.log(res);
    });
  });

  describe("tags::get_languages", async () => {
    it("tags::get_languages", async () => {
      let res = await golos.api.getLanguagesAsync();
      console.log(res);
      res.should.be.a('object');

      res.should.have.property('languages');
      res.languages.should.be.a('array');

      res.languages.forEach((val) => {
        val.should.be.a('string');
      });
    });
  });
// TAGS END */


/* SOCIAL NETWORK BEGIN
  describe("social_network::get_replies_by_last_update", async () => {
    it("social_network::get_replies_by_last_update", async () => {
      let actorName = 'get-content-test';
      let res = await golos.api.getRepliesByLastUpdateAsync(actorName, actorName, 10, -1);

      res.forEach((o) => {
        checkCommentApiObject(o);
      });
     
    }).timeout(10000);;
  });

  describe("social_network::get_content", async () => {
    it("social_network::get_content", async () => {
      let actorName = 'get-content-test'; 
      let res = await golos.api.getContentAsync(actorName, actorName, 2);

      await checkCommentApiObject(res);
    });
  });

  describe("social_network::get_content_replies", async () => {
    it("social_network::get_content_replies", async () => {
      let actorName = 'get-content-test';
      let res = await golos.api.getContentRepliesAsync(actorName, actorName, -1);
      res.forEach(checkCommentApiObject);
    });

  });

  describe("social_network::get_all_content_replies", async () => {
    it("social_network::get_all_content_replies", async () => {
      try {
        let actorName = 'get-content-test';
        let res = await golos.api.getAllContentRepliesAsync(actorName, actorName, 0);
        res.forEach(checkCommentApiObject);
      }
      catch(err) {
        console.log(JSON.stringify(err));
      }
    }).timeout(5000);
  });

  describe("social_network::get_active_votes", async () => {
    it("social_network::get_active_votes", async () => {
      let actorName = 'get-content-test';
      let res = await golos.api.getActiveVotesAsync(actorName, actorName, -1);
      res.forEach(checkVote);
    });
  });

  describe("social_network::get_account_votes", async () => {
    it("social_network::get_account_votes", async () => {
      let replier2 = 'replier2';
      let res = await golos.api.getAccountVotesAsync(replier2, 0, -1);
      res.forEach((val) => {
        val.should.be.a('object');

        val.should.have.property('authorperm');
        val.authorperm.should.be.a('string');

        val.should.have.property('weight');
        val.weight.should.satisfy(isNumber);

        val.should.have.property('rshares');
        val.rshares.should.satisfy(isNumber);

        val.should.have.property('percent');
        val.percent.should.satisfy(isNumber);

        val.should.have.property('time');
        val.time.should.be.a('string');
      });
    });
  });
// SOCIAL NETWORK END */

//* DATABASE API BEGIN
  const GDPO = async () => {
    let res = await golos.api.getDynamicGlobalPropertiesAsync();
    return res;
  };

  describe("database_api::get_block_header", async () => {
    it("database_api::get_block_header", async () => {
      let dpo = await GDPO();

      let res = await golos.api.getBlockHeaderAsync(dpo.head_block_number);
      console.log(res);

      res.should.be.a('object');

      res.should.have.property('previous');
      res.should.have.property('timestamp');
      res.should.have.property('witness');
      res.should.have.property('transaction_merkle_root');
      res.should.have.property('extensions');

      res.previous.should.be.a('string');
      res.timestamp.should.be.a('string');
      res.witness.should.be.a('string');
      res.transaction_merkle_root.should.be.a('string');
      res.extensions.should.be.a('array');
    });
  });

  describe("database_api::get_block", async () => {
    it("database_api::get_block", async () => {

      const getBlocksWithTransactions = async () => {
        let blocks = [];
        let currentLastBlock = (await GDPO()).head_block_number;
        for (let i = 1; i < currentLastBlock; i++) {
          let res = await golos.api.getBlockAsync(i);
          if (res.transactions.length > 0 ) {
            blocks.push(res);
          }
        }
        return blocks;
      }

      let blocks = await getBlocksWithTransactions();
      let dpo = await GDPO();
      // console.log(JSON.stringify(blocks, null, 2));
      let res = await golos.api.getBlockAsync(dpo.head_block_number);

      console.log(res);

      res.should.be.a('object');

      res.should.have.property('previous');
      res.should.have.property('timestamp');
      res.should.have.property('witness');
      res.should.have.property('transaction_merkle_root');
      res.should.have.property('extensions');
      res.should.have.property('witness_signature');
      res.should.have.property('transactions');

      res.previous.should.be.a('string');
      res.timestamp.should.be.a('string');
      res.witness.should.be.a('string');
      res.transaction_merkle_root.should.be.a('string');
      res.extensions.should.be.a('array');
      res.witness_signature.should.be.a('string');
      res.transactions.should.be.a('array');

      res.transactions.forEach((o) => {
        o.should.be.a('object');

        o.should.have.property('ref_block_num');
        o.should.have.property('ref_block_prefix');
        o.should.have.property('expiration');
        o.should.have.property('operations');
        o.should.have.property('extensions');
        o.should.have.property('signatures');

        o.ref_block_num.should.satisfy(isNumber);
        o.ref_block_prefix.should.satisfy(isNumber);
        o.expiration.should.be.a('string');
        o.operations.should.be.a('array');
        o.extensions.should.be.a('array');
        o.signatures.should.be.a('array');
      });

      let firstPow2Idx = -1;

      for (let i = 0; firstPow2Idx == -1 && i < blocks.length; i++) {
        for (let j = 0; firstPow2Idx == -1 && j < blocks[i].transactions.length; j++) {
          console.log(blocks[i].transactions[j]);
          if (blocks[i].transactions[j].operations[0][0] == "pow2") {
            let x = blocks[i].transactions[j].operations[0][1];

            x.should.be.a('object');

            x.should.have.property('work');
            x.should.have.property('props');

            x.work.should.be.a('array');
            x.props.should.be.a('object');

            x.work[0].should.be.a('number');
            x.work[1].should.be.a('object');

            x.work[1].should.have.property('input');
            x.work[1].input.should.be.a('object');
            x.work[1].input.should.have.property('worker_account');
            x.work[1].input.should.have.property('prev_block');
            x.work[1].input.should.have.property('nonce');
            x.work[1].input.worker_account.should.be.a('string');
            x.work[1].input.prev_block.should.be.a('string');
            x.work[1].input.nonce.should.be.a('string');
            
            x.work[1].should.have.property('pow_summary');
            x.work[1].pow_summary.should.be.a('number');

            x.props.should.be.a('object');
            x.props.should.have.property('account_creation_fee');
            x.props.account_creation_fee.should.be.a('string');
            x.props.should.have.property('maximum_block_size');
            x.props.maximum_block_size.should.be.a('number');
            x.props.should.have.property('sbd_interest_rate');
            x.props.sbd_interest_rate.should.be.a('number');

            firstPow2Idx = i;
          }
        }
      }

    });
  });

  describe("database_api::get_config", async () => {
    it("database_api::get_config", async () => {
      let res = await golos.api.getConfigAsync();
      console.log(res);

      res.should.be.a('object');
      res.STEEMIT_BUILD_TESTNET.should.be.a('boolean');
      res.GRAPHENE_CURRENT_DB_VERSION.should.be.a('string');
      res.SBD_SYMBOL.should.satisfy(isNumber);
      res.STEEMIT_100_PERCENT.should.satisfy(isNumber);
      res.STEEMIT_1_PERCENT.should.satisfy(isNumber);
      res.STEEMIT_ADDRESS_PREFIX.should.be.a('string');
      res.STEEMIT_APR_PERCENT_MULTIPLY_PER_BLOCK.should.be.a('string');
      res.STEEMIT_APR_PERCENT_MULTIPLY_PER_HOUR.should.be.a('string');
      res.STEEMIT_APR_PERCENT_MULTIPLY_PER_ROUND.should.be.a('string');
      res.STEEMIT_APR_PERCENT_SHIFT_PER_BLOCK.should.satisfy(isNumber);
      res.STEEMIT_APR_PERCENT_SHIFT_PER_HOUR.should.satisfy(isNumber);
      res.STEEMIT_APR_PERCENT_SHIFT_PER_ROUND.should.satisfy(isNumber);
      res.STEEMIT_BANDWIDTH_AVERAGE_WINDOW_SECONDS.should.satisfy(isNumber);
      res.STEEMIT_BANDWIDTH_PRECISION.should.satisfy(isNumber);
      res.STEEMIT_BLOCKCHAIN_PRECISION.should.satisfy(isNumber);
      res.STEEMIT_BLOCKCHAIN_PRECISION_DIGITS.should.satisfy(isNumber);
      res.STEEMIT_BLOCKCHAIN_HARDFORK_VERSION.should.be.a('string');
      res.STEEMIT_BLOCKCHAIN_VERSION.should.be.a('string');
      res.STEEMIT_BLOCK_INTERVAL.should.satisfy(isNumber);
      res.STEEMIT_BLOCKS_PER_DAY.should.satisfy(isNumber);
      res.STEEMIT_BLOCKS_PER_HOUR.should.satisfy(isNumber);
      res.STEEMIT_BLOCKS_PER_YEAR.should.satisfy(isNumber);
      res.STEEMIT_CASHOUT_WINDOW_SECONDS.should.satisfy(isNumber);
      res.STEEMIT_CHAIN_ID.should.be.a('string');
      res.STEEMIT_CONTENT_APR_PERCENT.should.satisfy(isNumber);
      res.STEEMIT_CONVERSION_DELAY.should.be.a('string');
      res.STEEMIT_CURATE_APR_PERCENT.should.satisfy(isNumber);
      res.STEEMIT_DEFAULT_SBD_INTEREST_RATE.should.satisfy(isNumber);
      res.STEEMIT_FEED_HISTORY_WINDOW.should.satisfy(isNumber);
      res.STEEMIT_FEED_INTERVAL_BLOCKS.should.satisfy(isNumber);
      res.STEEMIT_FREE_TRANSACTIONS_WITH_NEW_ACCOUNT.should.satisfy(isNumber);
      res.STEEMIT_GENESIS_TIME.should.be.a('string');
      res.STEEMIT_HARDFORK_REQUIRED_WITNESSES.should.satisfy(isNumber);
      res.STEEMIT_INIT_MINER_NAME.should.be.a('string');
      res.STEEMIT_INIT_PUBLIC_KEY_STR.should.be.a('string');
      res.STEEMIT_INIT_SUPPLY.should.be.a('string');
      res.STEEMIT_INIT_TIME.should.be.a('string');
      res.STEEMIT_IRREVERSIBLE_THRESHOLD.should.satisfy(isNumber);
      res.STEEMIT_LIQUIDITY_APR_PERCENT.should.satisfy(isNumber);
      res.STEEMIT_LIQUIDITY_REWARD_BLOCKS.should.satisfy(isNumber);
      res.STEEMIT_LIQUIDITY_REWARD_PERIOD_SEC.should.satisfy(isNumber);
      res.STEEMIT_LIQUIDITY_TIMEOUT_SEC.should.be.a('string');
      res.STEEMIT_MAX_ACCOUNT_NAME_LENGTH.should.satisfy(isNumber);
      res.STEEMIT_MAX_ACCOUNT_WITNESS_VOTES.should.satisfy(isNumber);
      res.STEEMIT_MAX_ASSET_WHITELIST_AUTHORITIES.should.satisfy(isNumber);
      res.STEEMIT_MAX_AUTHORITY_MEMBERSHIP.should.satisfy(isNumber);
      res.STEEMIT_MAX_BLOCK_SIZE.should.satisfy(isNumber);
      res.STEEMIT_MAX_CASHOUT_WINDOW_SECONDS.should.satisfy(isNumber);
      res.STEEMIT_MAX_COMMENT_DEPTH.should.satisfy(isNumber);
      res.STEEMIT_MAX_FEED_AGE.should.be.a('string');
      res.STEEMIT_MAX_INSTANCE_ID.should.be.a('string');
      res.STEEMIT_MAX_MEMO_SIZE.should.satisfy(isNumber);
      res.STEEMIT_MAX_WITNESSES.should.satisfy(isNumber);
      res.STEEMIT_MAX_MINER_WITNESSES.should.satisfy(isNumber);
      res.STEEMIT_MAX_PROXY_RECURSION_DEPTH.should.satisfy(isNumber);
      res.STEEMIT_MAX_RATION_DECAY_RATE.should.satisfy(isNumber);
      res.STEEMIT_MAX_RESERVE_RATIO.should.satisfy(isNumber);
      res.STEEMIT_MAX_RUNNER_WITNESSES.should.satisfy(isNumber);
      res.STEEMIT_MAX_SHARE_SUPPLY.should.be.a('string');
      res.STEEMIT_MAX_SIG_CHECK_DEPTH.should.satisfy(isNumber);
      res.STEEMIT_MAX_TIME_UNTIL_EXPIRATION.should.satisfy(isNumber);
      res.STEEMIT_MAX_TRANSACTION_SIZE.should.satisfy(isNumber);
      res.STEEMIT_MAX_UNDO_HISTORY.should.satisfy(isNumber);
      res.STEEMIT_MAX_URL_LENGTH.should.satisfy(isNumber);
      res.STEEMIT_MAX_VOTE_CHANGES.should.satisfy(isNumber);
      res.STEEMIT_MAX_VOTED_WITNESSES.should.satisfy(isNumber);
      res.STEEMIT_MAX_WITHDRAW_ROUTES.should.satisfy(isNumber);
      res.STEEMIT_MAX_WITNESS_URL_LENGTH.should.satisfy(isNumber);
      res.STEEMIT_MIN_ACCOUNT_CREATION_FEE.should.satisfy(isNumber);
      res.STEEMIT_MIN_ACCOUNT_NAME_LENGTH.should.satisfy(isNumber);
      res.STEEMIT_MIN_BLOCK_SIZE_LIMIT.should.satisfy(isNumber);
      res.STEEMIT_MIN_CONTENT_REWARD.should.be.a('string');
      res.STEEMIT_MIN_CURATE_REWARD.should.be.a('string');
      res.STEEMIT_MINER_ACCOUNT.should.be.a('string');
      res.STEEMIT_MINER_PAY_PERCENT.should.satisfy(isNumber);
      res.STEEMIT_MIN_FEEDS.should.satisfy(isNumber);
      res.STEEMIT_MINING_REWARD.should.be.a('string');
      res.STEEMIT_MINING_TIME.should.be.a('string');
      res.STEEMIT_MIN_LIQUIDITY_REWARD.should.be.a('string');
      res.STEEMIT_MIN_LIQUIDITY_REWARD_PERIOD_SEC.should.satisfy(isNumber);
      res.STEEMIT_MIN_PAYOUT_SBD.should.be.a('string');
      res.STEEMIT_MIN_POW_REWARD.should.be.a('string');
      res.STEEMIT_MIN_PRODUCER_REWARD.should.be.a('string');
      res.STEEMIT_MIN_RATION.should.satisfy(isNumber);
      res.STEEMIT_MIN_TRANSACTION_EXPIRATION_LIMIT.should.satisfy(isNumber);
      res.STEEMIT_MIN_TRANSACTION_SIZE_LIMIT.should.satisfy(isNumber);
      res.STEEMIT_MIN_UNDO_HISTORY.should.satisfy(isNumber);
      res.STEEMIT_NULL_ACCOUNT.should.be.a('string');
      res.STEEMIT_NUM_INIT_MINERS.should.satisfy(isNumber);
      res.STEEMIT_POW_APR_PERCENT.should.satisfy(isNumber);
      res.STEEMIT_PRODUCER_APR_PERCENT.should.satisfy(isNumber);
      res.STEEMIT_PROXY_TO_SELF_ACCOUNT.should.be.a('string');
      res.STEEMIT_SBD_INTEREST_COMPOUND_INTERVAL_SEC.should.satisfy(isNumber);
      res.STEEMIT_SECONDS_PER_YEAR.should.satisfy(isNumber);
      res.STEEMIT_REVERSE_AUCTION_WINDOW_SECONDS.should.satisfy(isNumber);
      res.STEEMIT_START_MINER_VOTING_BLOCK.should.satisfy(isNumber);
      res.STEEMIT_START_VESTING_BLOCK.should.satisfy(isNumber);
      res.STEEMIT_SYMBOL.should.be.a('string');
      res.STEEMIT_TEMP_ACCOUNT.should.be.a('string');
      res.STEEMIT_UPVOTE_LOCKOUT.should.satisfy(isNumber);
      res.STEEMIT_VESTING_WITHDRAW_INTERVALS.should.satisfy(isNumber);
      res.STEEMIT_VESTING_WITHDRAW_INTERVAL_SECONDS.should.satisfy(isNumber);
      res.STEEMIT_VOTE_CHANGE_LOCKOUT_PERIOD.should.satisfy(isNumber);
      res.STEEMIT_VOTE_REGENERATION_SECONDS.should.satisfy(isNumber);
      res.STEEM_SYMBOL.should.be.a('string');
      res.VESTS_SYMBOL.should.be.a('string');
      res.BLOCKCHAIN_NAME.should.be.a('string');
    });
  });

  describe("database_api::get_dynamic_global_properties", async () => {
    it("database_api::get_dynamic_global_properties", async () => {
      let res = await golos.api.getDynamicGlobalPropertiesAsync();
      console.log(res);

      res.should.be.a('object');
      res.id.should.satisfy(isNumber);
      res.head_block_number.should.satisfy(isNumber);
      res.head_block_id.should.be.a('string');
      res.time.should.be.a('string');
      res.current_witness.should.be.a('string');
      res.total_pow.should.satisfy(isNumber);
      res.num_pow_witnesses.should.satisfy(isNumber);
      res.virtual_supply.should.be.a('string');
      res.current_supply.should.be.a('string');
      res.confidential_supply.should.be.a('string');
      res.current_sbd_supply.should.be.a('string');
      res.confidential_sbd_supply.should.be.a('string');
      res.total_vesting_fund_steem.should.be.a('string');
      res.total_vesting_shares.should.be.a('string');
      res.total_reward_fund_steem.should.be.a('string');
      res.total_reward_shares2.should.be.a('string');
      res.sbd_interest_rate.should.satisfy(isNumber);
      res.sbd_print_rate.should.satisfy(isNumber);
      res.average_block_size.should.satisfy(isNumber);
      res.maximum_block_size.should.satisfy(isNumber);
      res.current_aslot.should.satisfy(isNumber);
      res.recent_slots_filled.should.be.a('string');
      res.participation_count.should.satisfy(isNumber);
      res.last_irreversible_block_num.should.satisfy(isNumber);
      res.max_virtual_bandwidth.should.be.a('string');
      res.current_reserve_ratio.should.satisfy(isNumber);
      res.vote_regeneration_per_day.should.satisfy(isNumber);
    });
  });

  describe("database_api::get_chain_properties", async () => {
    it("database_api::get_chain_properties", async () => {
      let res = await golos.api.getChainPropertiesAsync();
      console.log(res);

      res.should.be.a('object');
      res.account_creation_fee.should.be.a('string');
      res.maximum_block_size.should.satisfy(isNumber);
      res.sbd_interest_rate.should.satisfy(isNumber);
      res.create_account_min_golos_fee.should.be.a('string');
      res.create_account_min_delegation.should.be.a('string');
      res.create_account_delegation_time.should.satisfy(isNumber);
      res.min_delegation.should.be.a('string');
    });
  });

  describe("database_api::get_hardfork_version", async () => {
    it("database_api::get_hardfork_version", async () => {
      let res = await golos.api.getHardforkVersionAsync();

      res.should.be.a('string');
      res.should.satisfy((o) => {
        let arr = o.split('.');
        arr.length.should.eql(3);

        arr.forEach((val) => {
          val = parseInt(val);
          val.should.satisfy(isNumber);
          val.should.satisfy((num) => { return num >= 0; });
        });

        return true;
      });
    });
  });

  describe("database_api::get_next_scheduled_hardfork", async () => {
    it("database_api::get_next_scheduled_hardfork", async () => {
      let res = await golos.api.getNextScheduledHardforkAsync();
      console.log(res);

      res.should.be.a('object');
      res.hf_version.should.be.a('string');
      res.live_time.should.be.a('string');
    });
  });

  describe("database_api::get_account_count", async () => {
    it("database_api::get_account_count", async () => {
      let res = await golos.api.getAccountCountAsync();
      console.log(res);

      res.should.satisfy(isNumber);
      res.should.satisfy( (val) => {
        return val >= -1;
      });
    });
  });

  describe("database_api::get_owner_history", async () => {
    it("database_api::get_owner_history", async () => {
      let res = await golos.api.getOwnerHistoryAsync('test');
      console.log(res);

      res.forEach((val) => {
        val.should.have.property('account');
        val.account.should.be.a('string');

        val.should.have.property('previous_owner_authority');
        val.previous_owner_authority.should.be.an('object');
        val.previous_owner_authority.should.have.property('weight_threshold');
        val.previous_owner_authority.weight_threshold.should.satisfy(isNumber);
        val.previous_owner_authority.should.have.property('account_auths');
        val.previous_owner_authority.account_auths.should.be.an('array');
        val.previous_owner_authority.should.have.property('key_auths');
        val.previous_owner_authority.key_auths.should.be.an('array');

        val.should.have.property('last_valid_time');
        val.last_valid_time.should.be.a('string');
      });
    });
  });

  describe("database_api::get_recovery_request", async () => {
    it("database_api::get_recovery_request", async () => {
      let res = await golos.api.getRecoveryRequestAsync('test');
      console.log(res);

      res.should.have.property('account_to_recover');
      res.account_to_recover.should.be.a('string');

      res.should.have.property('new_owner_authority');
      res.new_owner_authority.should.be.an('object');
      res.new_owner_authority.should.have.property('weight_threshold');
      res.new_owner_authority.weight_threshold.should.satisfy(isNumber);
      res.new_owner_authority.should.have.property('account_auths');
      res.new_owner_authority.account_auths.should.be.an('array');
      res.new_owner_authority.should.have.property('key_auths');
      res.new_owner_authority.key_auths.should.be.an('array');

      res.should.have.property('expires');
      res.expires.should.be.a('string');
    });
  });

  // describe("database_api::get_escrow", async () => {
  //   it("database_api::get_escrow", async () => {
  //     let res = await golos.api.getEscrowAsync(100);
  //     console.log(res);

  //     res.should.have.property('escrow_id');
  //     res.escrow_id.should.satisfy(isNumber);

  //     res.should.have.property('from');
  //     res.from.should.be.a('string');

  //     res.should.have.property('to');
  //     res.to.should.be.a('string');

  //     res.should.have.property('agent');
  //     res.agent.should.be.a('string');

  //     res.should.have.property('ratification_deadline');
  //     res.ratification_deadline.should.be.a('string');

  //     res.should.have.property('escrow_expiration');
  //     res.escrow_expiration.should.be.a('string');

  //     res.should.have.property('sbd_balance');
  //     res.sbd_balance.should.be.a('string');

  //     res.should.have.property('steem_balance');
  //     res.steem_balance.should.be.a('string');

  //     res.should.have.property('pending_fee');
  //     res.pending_fee.should.be.a('string');

  //     res.should.have.property('to_approved');
  //     res.to_approved.should.be.a('boolean');

  //     res.should.have.property('agent_approved');
  //     res.agent_approved.should.be.a('boolean');

  //     res.should.have.property('disputed');
  //     res.disputed.should.be.a('boolean');
  //   });
  // });

  describe("database_api::get_withdraw_routes", async () => {
    it("database_api::get_withdraw_routes", async () => {
      let res = await golos.api.getWithdrawRoutesAsync('test', 'all');
      console.log(res);

      res.forEach((val) => {
        val.should.have.property('from_account');
        val.from_account.should.be.a('string');

        val.should.have.property('to_account');
        val.to_account.should.be.a('string');

        val.should.have.property('percent');
        val.percent.should.satisfy(isNumber);

        val.should.have.property('auto_vest');
        val.auto_vest.should.be.a('boolean');
      });
    });
  });

  describe("database_api::get_account_bandwidth", async () => {
    it("database_api::get_account_bandwidth", async () => {
      let res = await golos.api.getAccountBandwidthAsync('test', 'post');
      console.log(res);

      res.should.have.property('account');
      res.should.have.property('type');
      res.should.have.property('average_bandwidth');
      res.should.have.property('lifetime_bandwidth');
      res.should.have.property('last_bandwidth_update');

      res.account.should.be.a('string');
      res.type.should.be.a('string');
      res.average_bandwidth.should.satisfy(isNumber);
      res.lifetime_bandwidth.should.satisfy(isNumber);
      res.last_bandwidth_update.should.be.a('string');
    });
  });

  describe("database_api::get_savings_withdraw_from", async () => {
    it("database_api::get_savings_withdraw_from", async () => {
      let res = await golos.api.getSavingsWithdrawFromAsync('cyberfounder');
      console.log(res);
    });

  });

  describe("database_api::get_savings_withdraw_to", async () => {
    it("database_api::get_savings_withdraw_to", async () => {
      let res = await golos.api.getSavingsWithdrawToAsync('cyberfounder');
      console.log(res);
    });

  });

  describe("database_api::get_conversion_requests", async () => {
    it("database_api::get_conversion_requests", async () => {
      let res = await golos.api.getConversionRequestsAsync('cyberfounder');
      console.log(res);
    });

  });

  describe("database_api::get_transaction_hex", async () => {
    it("database_api::get_transaction_hex", async () => {
      let res = await golos.api.get_transactionHex('cyberfounder');
      console.log(res); // TODO
    });

  });

  describe("database_api::get_required_signatures", async () => {
    it("database_api::get_required_signatures", async () => {
    });

  });

  describe("database_api::get_potential_signatures", async () => {
    it("database_api::get_potential_signatures", async () => {
    });

  });

  describe("database_api::verify_authority", async () => {
    it("database_api::verify_authority", async () => {
      let res = await golos.api.verifyAuthorityAsync();
      console.log(res);
    });

  });

  describe("database_api::verify_account_authority", async () => {
    it("database_api::verify_account_authority", async () => {
    });

  });

  describe("database_api::get_accounts", async () => {
    it("database_api::get_accounts", async () => {
    });

  });

  describe("database_api::lookup_account_names", async () => {
    it("database_api::lookup_account_names", async () => {
    });

  });

  describe("database_api::lookup_accounts", async () => {
    it("database_api::lookup_accounts", async () => {
    });

  });

  describe("database_api::get_proposed_transaction", async () => {
    it("database_api::get_proposed_transaction", async () => {
    });

  });

  describe("database_api::get_database_info", async () => {
    it("database_api::get_database_info", async () => {
      let res = await golos.api.getDatabaseInfoAsync();
      console.log(res);


      res.should.be.a('object');

      res.should.have.property('total_size');
      res.should.have.property('free_size');
      res.should.have.property('reserved_size');
      res.should.have.property('used_size');
      res.should.have.property('index_list');

      res.total_size.should.be.a('number');
      res.free_size.should.be.a('number');
      res.reserved_size.should.be.a('number');
      res.used_size.should.be.a('number');
      res.index_list.should.be.a('array');

      const checkInfoRecord = (x) => {
        x.should.be.a('object');

        x.should.have.property('name');
        x.should.have.property('record_count');

        x.name.should.be.a('string');
        x.record_count.should.be.a('number');
      };

      res.index_list.forEach(checkInfoRecord)
    });
  });

  describe("database_api::get_vesting_delegations", async () => {
    it("database_api::get_vesting_delegations", async () => {
      let res = await golos.api.getVestingDelegationsAsync();
      console.log(res);
    });

  });

  describe("database_api::get_expiring_vesting_delegations", async () => {
    it("database_api::get_expiring_vesting_delegations", async () => {
      let res = await golos.api.getExpiringVestingDelegationsAsync();
      console.log(res);
    });
  });
// DATABASE API END */

/* FOLLOW BEGIN
  describe("follow::get_followers", async () => {
    it("follow::get_followers", async () => {

      let following = "blogger1";
      let startFollower = '';
      let followType = null;
      let limit = 100;

      let res = await golos.api.getFollowersAsync(following, startFollower, followType, limit);
      console.log(res);

      res.should.be.a('array');
      res.forEach((val) => {
        val.should.be.a('object');

        val.should.have.property('follower');
        val.should.have.property('following');
        val.should.have.property('what');

        val.follower.should.be.a('string');
        val.following.should.be.a('string');
        val.what.should.be.a('array');
      });
    });

  });

  describe("follow::get_following", async () => {
    it("follow::get_following", async () => {
      let follower = "subscriber1";
      let startFollower = '';
      let followType = null;
      let limit = 100;

      let res = await golos.api.getFollowingAsync(follower, startFollower, followType, limit);
      console.log(res);


      res.should.be.a('array');
      res.forEach((val) => {
        val.should.be.a('object');

        val.should.have.property('follower');
        val.should.have.property('following');
        val.should.have.property('what');

        val.follower.should.be.a('string');
        val.following.should.be.a('string');
        val.what.should.be.a('array');
      });
    });

  });

  describe("follow::get_follow_count", async () => {
    it("follow::get_follow_count", async () => {

      let account = "blogger1";
      let res = await golos.api.getFollowCountAsync(account);

      console.log(res);

      res.should.be.a('object');
      
      res.should.have.property('account');
      res.should.have.property('follower_count');
      res.should.have.property('following_count');
      res.should.have.property('limit');

      res.account.should.be.a('string');
      res.follower_count.should.be.a('number');
      res.following_count.should.be.a('number');
      res.limit.should.be.a('number');
    });

  });

  describe("follow::get_feed_entries", async () => {
    it("follow::get_feed_entries", async () => {

      let account = "blogger1";
      let res = await golos.api.getFeedEntriesAsync(account, 0, 100);

      console.log(res);

      res.should.be.a('array');
      res.forEach(async (val) => {
        val.should.be.a('object');

        val.should.have.property('author');
        val.should.have.property('permlink');
        val.should.have.property('reblog_by');
        val.should.have.property('reblog_entries');
        val.should.have.property('reblog_on');
        val.should.have.property('entry_id');

        val.author.should.be.a('string');
        val.permlink.should.be.a('string');
        val.reblog_by.should.be.a('array');
        val.reblog_entries.should.be.a('array');
        val.reblog_on.should.be.a('string');
        val.entry_id.should.be.a('number');
      });
    });

  });

  describe("follow::get_feed", async () => {
    it("follow::get_feed", async () => {

      let account = "blogger1";
      let res = await golos.api.getFeedAsync(account, 0, 100);

      console.log(res);

      res.should.be.a('array');

      res.forEach(async (val) => {
        val.should.be.a('object');
        val.should.have.property('comment');

        val.comment.should.be.a('object');

        await followCommentCheck(val.comment);

        val.should.have.property('reblog_by');
        val.should.have.property('reblog_entries');
        val.should.have.property('reblog_on');
        val.should.have.property('entry_id');

        val.reblog_by.should.be.a('array')
        val.reblog_entries.should.be.a('array')
        val.reblog_on.should.be.a('string')
        val.entry_id.should.be.a('number')
      });
    });

  });

  describe("follow::get_blog_entries", async () => {
    it("follow::get_blog_entries", async () => {
      let account = "blogger1";
      let res = await golos.api.getBlogEntriesAsync(account, 0, 100);
      
      console.log(res);

      res.should.be.a('array');

      res.forEach(async (val) => {
        val.should.be.a('object');
        val.should.have.property('author');
        val.should.have.property('permlink');
        val.should.have.property('blog');
        val.should.have.property('reblog_on');
        val.should.have.property('entry_id');
        val.should.have.property('reblog_title');
        val.should.have.property('reblog_body');
        val.should.have.property('reblog_json_metadata');

        val.author.should.be.a('string');
        val.permlink.should.be.a('string');
        val.blog.should.be.a('string');
        val.reblog_on.should.be.a('string');
        val.entry_id.should.be.a('number');
        val.reblog_title.should.be.a('string');
        val.reblog_body.should.be.a('string');
        val.reblog_json_metadata.should.be.a('string');
      });
    });

  });

  describe("follow::get_blog", async () => {
    it("follow::get_blog", async () => {
      let account = "blogger1";
      let res = await golos.api.getBlogAsync(account, 0, 100);

      console.log(res);


      res.should.be.a('array');

      res.forEach(async (val) => {
        val.should.be.a('object');
        val.should.have.property('comment');

        val.comment.should.be.a('object');

        await followCommentCheck(val.comment);

        val.should.have.property('blog');
        val.should.have.property('reblog_on');
        val.should.have.property('entry_id');
        val.should.have.property('reblog_title');
        val.should.have.property('reblog_body');
        val.should.have.property('reblog_json_metadata');

        val.blog.should.be.a('string');
        val.reblog_on.should.be.a('string');
        val.entry_id.should.be.a('number');
        val.reblog_title.should.be.a('string');
        val.reblog_body.should.be.a('string');
        val.reblog_json_metadata.should.be.a('string');
      });
    });

  });

  describe("follow::get_account_reputations", async () => {
    it("follow::get_account_reputations", async () => {
      let names = ["blogger1", 'subscriber1', 'subscriber2'];
      let res = await golos.api.getAccountReputationsAsync(names);

      console.log(res);

      res.should.be.a('array');

      res.forEach(async (val) => {
        val.should.be.a('object');

        val.should.have.property('account');
        val.should.have.property('reputation');

        val.account.should.be.a('string');
        val.reputation.should.be.a('number');
      });
    });

  });

  describe("follow::get_reblogged_by", async () => {
    it("follow::get_reblogged_by", async () => {
      let author = "blogger1";
      let permlink = author;
      let res = await golos.api.getRebloggedByAsync(author, permlink);
      console.log(res);
      
      res.should.be.a('array');

      res.forEach(async (val) => {
        val.should.be.a('string');
      });
    });

  });

  //DEPRECATED
  describe("follow::get_blog_authors", async () => {
    it("follow::get_blog_authors", async () => {
      let blogAccount = "blogger1";
      let res = await golos.api.getBlogAuthorsAsync(blogAccount);

      res.should.be.a('array');
      console.log("DEPRECATED", res);
    });

  });
// FOLLOW END */


/*  ACCOUNT BY KEY BEGIN
  describe("account_by_key::get_key_references", async () => {
    it("account_by_key::get_key_references", async () => {
      let res = await golos.api.getKeyReferencesAsync(["GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6"]);
      console.log(res);

      res.should.be.a('array');
      res.forEach((x) => {
        x.should.be.a('array');
        x.forEach((y) => {
          y.should.be.a('string');
        })
      })
    });

  });
// ACCOUNT BY KEY END */

/*  NETWORK BROADCAST BEGIN
  describe("network_broadcast_api::broadcast_transaction", async () => {
    it("network_broadcast_api::broadcast_transaction", async () => {
    });

  });

  describe("network_broadcast_api::broadcast_transaction_with_callback", async () => {
    it("network_broadcast_api::broadcast_transaction_with_callback", async () => {
    });
  });

  describe("network_broadcast_api::broadcast_transaction_synchronous", async () => {
    it("network_broadcast_api::broadcast_transaction_synchronous", async () => {
    });
  });

  describe("network_broadcast_api::broadcast_block", async () => {
    it("network_broadcast_api::broadcast_block", async () => {
    });
  });
// NETWORK BROADCAST END */

/* MARKET HISTORY BEGIN
  describe("market_history::get_ticker", async () => {
    it("market_history::get_ticker", async () => {
      let res = await golos.api.getTickerAsync();
      console.log(res);

      res.should.be.a('object');
      res.should.have.property('latest');
      res.should.have.property('lowest_ask');
      res.should.have.property('highest_bid');
      res.should.have.property('percent_change');
      res.should.have.property('steem_volume');
      res.should.have.property('sbd_volume');

      res.latest.should.be.a('string');
      res.lowest_ask.should.be.a('string');
      res.highest_bid.should.be.a('string');
      res.percent_change.should.be.a('string');
      res.steem_volume.should.be.a('string');
      res.sbd_volume.should.be.a('string');

    });

  });

  describe("market_history::get_volume", async () => {
    it("market_history::get_volume", async () => {
      let res = await golos.api.getVolumeAsync();
      console.log(res);
      res.should.be.a('object');

      res.should.have.property('steem_volume');
      res.should.have.property('sbd_volume');

      res.steem_volume.should.be.a('string');
      res.sbd_volume.should.be.a('string');
    });
  });

  describe("market_history::get_order_book", async () => {
    it("market_history::get_order_book", async () => {
      let res = await golos.api.getOrderBookAsync(100);
      console.log(res);
      res.should.be.a('object');

      res.should.have.property("bids");
      res.should.have.property("asks");

      res.bids.should.be.a('array');
      res.asks.should.be.a('array');

      const checkOrder = (x) => {
        x.should.be.a('object');

        x.should.have.property('price');
        x.should.have.property('steem');
        x.should.have.property('sbd');

        x.price.should.be.a('string');
        x.steem.should.be.a('number');
        x.sbd.should.be.a('number');
      };

      res.bids.forEach(checkOrder);
      res.asks.forEach(checkOrder);
    });

  });

  var tradeTime = "";

  describe("market_history::get_order_book_extended", async () => {
    it("market_history::get_order_book_extended", async () => {
      let res = await golos.api.getOrderBookExtendedAsync(100);
      console.log(res);

      res.should.be.a('object');

      res.should.have.property('asks');
      res.should.have.property('bids');

      res.asks.should.be.a('array');
      res.bids.should.be.a('array');

      const checkExtendedOrder = async (order) => {
        // console.log(order)
        order.should.be.a('object');

        order.should.have.property('order_price');
        order.should.have.property('real_price');
        order.should.have.property('steem');
        order.should.have.property('sbd');
        order.should.have.property('created');

        order.order_price.should.satisfy((x) => {
          if (x == null) {
            return true;
          }
          checkPrice(x);
          return true
        });
        order.real_price.should.be.a('string');
        order.steem.should.be.a('number');
        order.sbd.should.be.a('number');
        order.created.should.be.a('string');
      };

      res.asks.forEach(checkExtendedOrder);
      res.bids.forEach(checkExtendedOrder);

      // memorizing the timestamp for get_trade_history and get_market_history
      if (res.asks.length > 0 && tradeTime == "") {
        tradeTime = res.asks[0].created;
      }

      if (tradeTime == "" && res.bids.length > 0) {
        tradeTime = res.bids[0].created;
      }
    });
  });

  describe("market_history::get_trade_history", async () => {
    it("market_history::get_trade_history", async () => {
      await waitConditionChange(async ()=> {
        return tradeTime != "";
      });
      console.log(tradeTime);

      let limits = await getWindowLimitsByTimestamp(tradeTime);

      let start = limits.start;
      let end   = limits.end;
      let res = await golos.api.getTradeHistoryAsync(start, end, 100);
      console.log(res);

      res.should.be.a('array');
      
      res.forEach((x) => {
        x.should.be.a('object');

        x.should.have.property('date');
        x.should.have.property('current_pays');
        x.should.have.property('open_pays');

        x.date.should.be.a('string');
        x.current_pays.should.be.a('string');
        x.open_pays.should.be.a('string');
      });
    });

  });

  describe("market_history::get_recent_trades", async () => {
    it("market_history::get_recent_trades", async () => {
      let res = await golos.api.getRecentTradesAsync(100);
      console.log(res);

      const checkTrade = (x) => {
        x.should.have.property('date');
        x.should.have.property('current_pays');
        x.should.have.property('open_pays');

        x.date.should.be.a('string');
        x.current_pays.should.be.a('string');
        x.open_pays.should.be.a('string');
      };

      res.forEach(checkTrade);
    });

  });

  describe("market_history::get_market_history", async () => {
    it("market_history::get_market_history", async () => {
      await waitConditionChange(async ()=> {
        return tradeTime != "";
      });
      console.log(tradeTime);

      let limits = await getWindowLimitsByTimestamp(tradeTime);

      let start = limits.start;
      let end   = limits.end;
      
      let res = await golos.api.getMarketHistoryAsync(15, start, end);
      console.log(res);

      const checkMarketHistoryObject = (x) => {
        x.should.be.a('object');

        x.should.have.property('id');
        x.should.have.property('open');
        x.should.have.property('seconds');
        x.should.have.property('high_steem');
        x.should.have.property('high_sbd');
        x.should.have.property('low_steem');
        x.should.have.property('low_sbd');
        x.should.have.property('open_steem');
        x.should.have.property('open_sbd');
        x.should.have.property('close_steem');
        x.should.have.property('close_sbd');
        x.should.have.property('steem_volume');
        x.should.have.property('sbd_volume');

        x.id.should.be.a('number');
        (new Date(x.open)).should.be.a('date');
        x.seconds.should.be.a('number');
        x.high_steem.should.be.a('number');
        x.high_sbd.should.be.a('number');
        x.low_steem.should.be.a('number');
        x.low_sbd.should.be.a('number');
        x.open_steem.should.be.a('number');
        x.open_sbd.should.be.a('number');
        x.close_steem.should.be.a('number');
        x.close_sbd.should.be.a('number');
        x.steem_volume.should.be.a('number');
        x.sbd_volume.should.be.a('number');
      }

      res.forEach(checkMarketHistoryObject);
    });
  });

  describe("market_history::get_market_history_buckets", async () => {
    it("market_history::get_market_history_buckets", async () => {
      let res = await golos.api.getMarketHistoryBucketsAsync();
      console.log(res);

      res.should.be.a('array');

      res.forEach((x) => {
        x.should.be.a('number');
      });
    });
  });

  describe("market_history::get_open_orders", async () => {
    it("market_history::get_open_orders", async () => {
      let res = await golos.api.getOpenOrdersAsync("seller0");
      console.log(res);

      res.should.be.a('array');

      const checkOpenOrder = (x) => {
        x.should.have.property('id');
        x.should.have.property('created');
        x.should.have.property('expiration');
        x.should.have.property('seller');
        x.should.have.property('orderid');
        x.should.have.property('for_sale');
        x.should.have.property('sell_price');
        x.should.have.property('real_price');
        x.should.have.property('rewarded');


        x.id.should.be.a('number');
        x.created.should.be.a('string');
        x.expiration.should.be.a('string');
        x.seller.should.be.a('string');
        x.orderid.should.be.a('number');
        x.for_sale.should.be.a('number');
        checkPrice(x.sell_price);
        x.real_price.should.be.a('string');
        x.rewarded.should.be.a('boolean');
      };

      res.forEach(checkOpenOrder)
    });
  });
// MARKET HISTORY END */

const checkPrice = (asset) => {
  asset.should.be.an('object');
  asset.should.have.property('base');
  asset.should.have.property('quote');
}

const checkWitness = async (witness) => {
  witness.should.be.a('object');

  witness.should.have.property('id');
  witness.id.should.satisfy(isNumber);

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
  witness.total_missed.should.satisfy(isNumber);

  witness.should.have.property('last_aslot');
  witness.last_aslot.should.satisfy(isNumber);

  witness.should.have.property('last_confirmed_block_num');
  witness.last_confirmed_block_num.should.satisfy(isNumber);

  witness.should.have.property('pow_worker');
  witness.pow_worker.should.satisfy(isNumber);

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
  witness.props.maximum_block_size.should.satisfy(isNumber);
  witness.props.sbd_interest_rate.should.satisfy(isNumber);
  witness.props.create_account_min_golos_fee.should.be.a('string');
  witness.props.create_account_min_delegation.should.be.a('string');
  witness.props.create_account_delegation_time.should.satisfy(isNumber);
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

const checkOperation = async(o) => {
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

const checkCommentApiObject = async (o) => {
  // console.log(o);
  o.should.be.a('object');

  o.should.have.property('id');
  o.should.have.property('author');
  o.should.have.property('permlink');
  o.should.have.property('parent_author');
  o.should.have.property('parent_permlink');
  o.should.have.property('category');
  o.should.have.property('title');
  o.should.have.property('body');
  o.should.have.property('json_metadata');
  o.should.have.property('last_update');
  o.should.have.property('created');
  o.should.have.property('active');
  o.should.have.property('last_payout');
  o.should.have.property('depth');
  o.should.have.property('children');
  o.should.have.property('children_rshares2');
  o.should.have.property('net_rshares');
  o.should.have.property('abs_rshares');
  o.should.have.property('vote_rshares');
  o.should.have.property('children_abs_rshares');
  o.should.have.property('cashout_time');
  o.should.have.property('max_cashout_time');
  o.should.have.property('total_vote_weight');
  o.should.have.property('reward_weight');
  o.should.have.property('total_payout_value');
  o.should.have.property('beneficiary_payout_value');
  o.should.have.property('beneficiary_gests_payout_value');
  o.should.have.property('curator_payout_value');
  o.should.have.property('curator_gests_payout_value');
  o.should.have.property('author_rewards');
  o.should.have.property('author_gbg_payout_value');
  o.should.have.property('author_golos_payout_value');
  o.should.have.property('author_gests_payout_value');
  o.should.have.property('net_votes');
  o.should.have.property('mode');
  o.should.have.property('auction_window_reward_destination');
  o.should.have.property('auction_window_size');
  o.should.have.property('auction_window_weight');
  o.should.have.property('votes_in_auction_window_weight');
  o.should.have.property('root_comment');
  o.should.have.property('root_title');
  o.should.have.property('max_accepted_payout');
  o.should.have.property('percent_steem_dollars');
  o.should.have.property('allow_replies');
  o.should.have.property('allow_votes');
  o.should.have.property('allow_curation_rewards');
  o.should.have.property('curation_rewards_percent');
  o.should.have.property('beneficiaries');
  o.should.have.property('url');
  o.should.have.property('pending_author_payout_value');
  o.should.have.property('pending_author_payout_gbg_value');
  o.should.have.property('pending_author_payout_gests_value');
  o.should.have.property('pending_author_payout_golos_value');
  o.should.have.property('pending_benefactor_payout_value');
  o.should.have.property('pending_benefactor_payout_gests_value');
  o.should.have.property('pending_curator_payout_value');
  o.should.have.property('pending_curator_payout_gests_value');
  o.should.have.property('pending_payout_value');
  o.should.have.property('total_pending_payout_value');
  o.should.have.property('active_votes');
  o.should.have.property('active_votes_count');
  o.should.have.property('replies');
  o.should.have.property('promoted');
  o.should.have.property('body_length');
  o.should.have.property('reblogged_by');
  o.should.have.property('reblog_entries');


  o.id.should.satisfy(isNumber);
  o.author.should.be.a('string');
  o.permlink.should.be.a('string');
  o.parent_author.should.be.a('string');
  o.parent_permlink.should.be.a('string');
  o.category.should.be.a('string');
  o.title.should.be.a('string');
  o.body.should.be.a('string');
  o.json_metadata.should.be.a('string');
  o.last_update.should.be.a('string');
  o.created.should.be.a('string');
  o.active.should.be.a('string');
  o.last_payout.should.be.a('string');
  o.depth.should.satisfy(isNumber);
  o.children.should.satisfy(isNumber);
  o.children_rshares2.should.be.a('string');
  o.net_rshares.should.satisfy(isNumber);
  o.abs_rshares.should.satisfy(isNumber);
  o.vote_rshares.should.satisfy(isNumber);
  o.children_abs_rshares.should.satisfy(isNumber);
  o.cashout_time.should.be.a('string');
  o.max_cashout_time.should.be.a('string');
  o.total_vote_weight.should.satisfy((val) => {
    return isNumber(val);
  });
  o.reward_weight.should.satisfy(isNumber);
  o.total_payout_value.should.be.a('string');
  o.beneficiary_payout_value.should.be.a('string');
  o.beneficiary_gests_payout_value.should.be.a('string');
  o.curator_payout_value.should.be.a('string');
  o.curator_gests_payout_value.should.be.a('string');
  o.author_rewards.should.satisfy(isNumber);
  o.author_gbg_payout_value.should.be.a('string');
  o.author_golos_payout_value.should.be.a('string');
  o.author_gests_payout_value.should.be.a('string');
  o.net_votes.should.satisfy(isNumber);
  o.mode.should.be.a('string');
  o.auction_window_reward_destination.should.be.a('string');
  o.auction_window_size.should.satisfy(isNumber);
  o.auction_window_weight.should.satisfy(isNumber);
  o.votes_in_auction_window_weight.should.satisfy(isNumber);
  o.root_comment.should.satisfy(isNumber);
  o.root_title.should.be.a('string');
  o.max_accepted_payout.should.be.a('string');
  o.percent_steem_dollars.should.satisfy(isNumber);
  o.allow_replies.should.be.a('boolean');
  o.allow_votes.should.be.a('boolean');
  o.allow_curation_rewards.should.be.a('boolean');
  o.curation_rewards_percent.should.satisfy(isNumber);
  o.beneficiaries.should.be.a('array');
  o.url.should.be.a('string');
  o.pending_author_payout_value.should.be.a('string');
  o.pending_author_payout_gbg_value.should.be.a('string');
  o.pending_author_payout_gests_value.should.be.a('string');
  o.pending_author_payout_golos_value.should.be.a('string');
  o.pending_benefactor_payout_value.should.be.a('string');
  o.pending_benefactor_payout_gests_value.should.be.a('string');
  o.pending_curator_payout_value.should.be.a('string');
  o.pending_curator_payout_gests_value.should.be.a('string');
  o.pending_payout_value.should.be.a('string');
  o.total_pending_payout_value.should.be.a('string');
  o.active_votes.should.be.a('array');
  o.active_votes_count.should.satisfy(isNumber);
  o.replies.should.be.a('array');
  o.promoted.should.be.a('string');
  o.body_length.should.satisfy(isNumber);
  o.reblogged_by.should.be.a('array');
  o.reblog_entries.should.be.a('array'); 
};

const isNumber = (val) => {
  return !isNaN(parseInt(val)) && isFinite(val);
};

const checkVote = async (o) => {
  o.should.be.a('object');

  o.should.have.property('voter');
  o.should.have.property('weight');
  o.should.have.property('rshares');
  o.should.have.property('percent');
  o.should.have.property('reputation');
  o.should.have.property('time');

  o.voter.should.be.a('string');
  o.weight.should.satisfy(isNumber);
  o.rshares.should.satisfy(isNumber);
  o.percent.should.satisfy(isNumber);
  o.reputation.should.satisfy(isNumber);
  o.time.should.be.a('string');
};


const followCommentCheck = (comment) => {
  comment.should.be.a('object');
  comment.should.have.property("id");
  comment.should.have.property("author");
  comment.should.have.property("permlink");
  comment.should.have.property("parent_author");
  comment.should.have.property("parent_permlink");
  comment.should.have.property("category");
  comment.should.have.property("title");
  comment.should.have.property("body");
  comment.should.have.property("json_metadata");
  comment.should.have.property("last_update");
  comment.should.have.property("created");
  comment.should.have.property("active");
  comment.should.have.property("last_payout");
  comment.should.have.property("depth");
  comment.should.have.property("children");
  comment.should.have.property("children_rshares2");
  comment.should.have.property("net_rshares");
  comment.should.have.property("abs_rshares");
  comment.should.have.property("vote_rshares");
  comment.should.have.property("children_abs_rshares");
  comment.should.have.property("cashout_time");
  comment.should.have.property("max_cashout_time");
  comment.should.have.property("total_vote_weight");
  comment.should.have.property("reward_weight");
  comment.should.have.property("total_payout_value");
  comment.should.have.property("beneficiary_payout_value");
  comment.should.have.property("beneficiary_gests_payout_value");
  comment.should.have.property("curator_payout_value");
  comment.should.have.property("curator_gests_payout_value");
  comment.should.have.property("author_rewards");
  comment.should.have.property("author_gbg_payout_value");
  comment.should.have.property("author_golos_payout_value");
  comment.should.have.property("author_gests_payout_value");
  comment.should.have.property("net_votes");
  comment.should.have.property("mode");
  comment.should.have.property("curation_reward_curve");
  comment.should.have.property("auction_window_reward_destination");
  comment.should.have.property("auction_window_size");
  comment.should.have.property("auction_window_weight");
  comment.should.have.property("votes_in_auction_window_weight");
  comment.should.have.property("root_comment");
  comment.should.have.property("root_title");
  comment.should.have.property("max_accepted_payout");
  comment.should.have.property("percent_steem_dollars");
  comment.should.have.property("allow_replies");
  comment.should.have.property("allow_votes");
  comment.should.have.property("allow_curation_rewards");
  comment.should.have.property("curation_rewards_percent");
  comment.should.have.property("beneficiaries");

  comment.id.should.be.a('number');
  comment.author.should.be.a('string');
  comment.permlink.should.be.a('string');
  comment.parent_author.should.be.a('string');
  comment.parent_permlink.should.be.a('string');
  comment.category.should.be.a('string');
  comment.title.should.be.a('string');
  comment.body.should.be.a('string');
  comment.json_metadata.should.be.a('string');
  comment.last_update.should.be.a('string');
  comment.created.should.be.a('string');
  comment.active.should.be.a('string');
  comment.last_payout.should.be.a('string');
  comment.depth.should.be.a('number');
  comment.children.should.be.a('number');
  comment.children_rshares2.should.be.a('string');
  comment.net_rshares.should.be.a('number');
  comment.abs_rshares.should.be.a('number');
  comment.vote_rshares.should.be.a('number');
  comment.children_abs_rshares.should.be.a('number');
  comment.cashout_time.should.be.a('string');
  comment.max_cashout_time.should.be.a('string');
  comment.total_vote_weight.should.be.a('number');
  comment.reward_weight.should.be.a('number');
  comment.total_payout_value.should.be.a('string');
  comment.beneficiary_payout_value.should.be.a('string');
  comment.beneficiary_gests_payout_value.should.be.a('string');
  comment.curator_payout_value.should.be.a('string');
  comment.curator_gests_payout_value.should.be.a('string');
  comment.author_rewards.should.be.a('number');
  comment.author_gbg_payout_value.should.be.a('string');
  comment.author_golos_payout_value.should.be.a('string');
  comment.author_gests_payout_value.should.be.a('string');
  comment.net_votes.should.be.a('number');
  comment.mode.should.be.a('string');
  comment.curation_reward_curve.should.be.a('string');
  comment.auction_window_reward_destination.should.be.a('string');
  comment.auction_window_size.should.be.a('number');
  comment.auction_window_weight.should.be.a('number');
  comment.votes_in_auction_window_weight.should.be.a('number');
  comment.root_comment.should.be.a('number');
  comment.root_title.should.be.a('string');
  comment.max_accepted_payout.should.be.a('string');
  comment.percent_steem_dollars.should.be.a('number');
  comment.allow_replies.should.be.a('boolean');
  comment.allow_votes.should.be.a('boolean');
  comment.allow_curation_rewards.should.be.a('boolean');
  comment.curation_rewards_percent.should.be.a('number');
  comment.beneficiaries.should.be.a('array');
};


const delay = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

const waitConditionChange = async(cond, ts = 100 * 1) => {
  while(true) {
    await delay(ts)

    let nowCondition = await cond();
    if (nowCondition == true) {
      break;
    }
  }
}

const getWindowLimitsByTimestamp = (timePoint) => {
  let tmp = timePoint.split('T');
  let dateString = tmp[0];
  let timeString = tmp[1]
  let date = dateString.split('-');

  let year = parseInt(date[0]);
  let result =  {
    start:  (year - 1).toString() + "-" + date[1] + "-" + date[2] + "T" + timeString,
    end:    (year + 1).toString() + "-" + date[1] + "-" + date[2] + "T" + timeString
  }
  return result;
}
