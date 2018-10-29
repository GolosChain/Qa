const chai    = require('chai');
const assertArrays = require('chai-arrays');
chai.use(assertArrays);

const should  = chai.should();
const expect  = chai.expect;
const path    = require('path');

const rootDir = path.resolve(process.cwd() + "/../golos-tests/");
const golos   = require('golos-js');

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

    res.id.should.be.a('number');
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
    res.id.should.be.a('number');

    res.should.have.property('current_virtual_time');
    res.current_virtual_time.should.be.a('string');

    res.should.have.property('next_shuffle_block_num');
    res.next_shuffle_block_num.should.be.a('number');

    res.should.have.property('current_shuffled_witnesses');
    res.current_shuffled_witnesses.should.be.a('string');

    res.should.have.property('num_scheduled_witnesses');
    res.num_scheduled_witnesses.should.be.a('number');

    res.should.have.property('top19_weight');
    res.top19_weight.should.be.a('number');

    res.should.have.property('timeshare_weight');
    res.timeshare_weight.should.be.a('number');

    res.should.have.property('miner_weight');
    res.miner_weight.should.be.a('number');

    res.should.have.property('witness_pay_normalization_factor');
    res.witness_pay_normalization_factor.should.be.a('number');

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
    res.median_props.maximum_block_size.should.be.a('number');
    res.median_props.sbd_interest_rate.should.be.a('number');
    res.median_props.create_account_min_golos_fee.should.be.a('string');
    res.median_props.create_account_min_delegation.should.be.a('string');
    res.median_props.create_account_delegation_time.should.be.a('number');
    res.median_props.min_delegation.should.be.a('string');


    res.should.have.property('majority_version');
    res.majority_version.should.be.a('string');
  });
});

describe("witness_api::get_witnesses", async () => {
  it("witness_api::get_witnesses", async () => {
    let res = await golos.api.getWitnessesAsync([4, 8, 15, 16, 23, 42]);

    checkArray(res, (val) => {
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
    // TODO
  });
});

describe("witness_api::get_witness_count", async () => {
  it("witness_api::get_witness_count", async () => {
    let res = await golos.api.getWitnessCount();
    res.should.be.a('number');
  });
});

describe("witness_api::lookup_witness_accounts", async () => {
  it("witness_api::lookup_witness_accounts", async () => {
    let res = await golos.api.lookupWitnessAccounts('cyberfounder', 100);
    checkArray(res, (val) => {
      val.should.be.a('string');
    });
  });
});

describe("witness_api::get_active_witnesses", async () => {
  it("witness_api::get_active_witnesses", async () => {
    let res = await golos.api.getActiveWitnesses();
    checkArray(res, (val) => {
      val.should.be.a('string');
    });
  });
});

describe("account_history::get_account_history", async () => {
  it("account_history::get_account_history", async () => {
    let res = await golos.api.getAccountHistory('cyberfounder');

    checkArray(res, (pair) => {
      pair[0].should.be.a('number');
      checkOperation(pair[1]);
    })
  });
});

describe("operation_history::get_ops_in_block", async () => {
  it("operation_history::get_ops_in_block", async () => {
    let res = await golos.api.getOpsInBlock(200);

    checkArray(res, (o) => {
      checkOperation(o);
    })
  });
});

describe("operation_history::get_transaction", async () => {
  it("operation_history::get_transaction", async () => {
    let res = await golos.api.getTransaction('d233796e0c6512fbef1fd00b9d829f98746b28e5');
console.log(res);
    res.should.have.property('ref_block_num');
    res.should.have.property('ref_block_prefix');
    res.should.have.property('expiration');
    res.should.have.property('operations');
    res.should.have.property('extensions');
    res.should.have.property('signatures');
    res.should.have.property('transaction_id');
    res.should.have.property('block_num');
    res.should.have.property('transaction_num');

    res.ref_block_num.should.be.a('number');
    res.ref_block_prefix.should.be.a('number');
    res.expiration.should.be.a('string');
    res.operations.should.be.a('array');
    res.extensions.should.be.a('array');
    res.signatures.should.be.a('array');
    res.transaction_id.should.be.a('string');
    res.block_num.should.be.a('number');
    res.transaction_num.should.be.a('number');
  });
});

describe("tags::get_trending_tags", async () => {
  it("tags::get_trending_tags", async () => {
  });

});

describe("tags::get_tags_used_by_author", async () => {
  it("tags::get_tags_used_by_author", async () => {
  });

});

describe("tags::get_discussions_by_payout", async () => {
  it("tags::get_discussions_by_payout", async () => {
  });

});

describe("tags::get_discussions_by_trending", async () => {
  it("tags::get_discussions_by_trending", async () => {
  });

});

describe("tags::get_discussions_by_created", async () => {
  it("tags::get_discussions_by_created", async () => {
  });

});

describe("tags::get_discussions_by_active", async () => {
  it("tags::get_discussions_by_active", async () => {
  });

});

describe("tags::get_discussions_by_cashout", async () => {
  it("tags::get_discussions_by_cashout", async () => {
  });

});

describe("tags::get_discussions_by_votes", async () => {
  it("tags::get_discussions_by_votes", async () => {
  });

});

describe("tags::get_discussions_by_children", async () => {
  it("tags::get_discussions_by_children", async () => {
  });

});

describe("tags::get_discussions_by_hot", async () => {
  it("tags::get_discussions_by_hot", async () => {
  });

});

describe("tags::get_discussions_by_feed", async () => {
  it("tags::get_discussions_by_feed", async () => {
  });

});

describe("tags::get_discussions_by_blog", async () => {
  it("tags::get_discussions_by_blog", async () => {
  });

});

describe("tags::get_discussions_by_comments", async () => {
  it("tags::get_discussions_by_comments", async () => {
  });

});

describe("tags::get_discussions_by_promoted", async () => {
  it("tags::get_discussions_by_promoted", async () => {
  });

});

describe("tags::get_discussions_by_author_before_date", async () => {
  it("tags::get_discussions_by_author_before_date", async () => {
  });

});

describe("tags::get_languages", async () => {
  it("tags::get_languages", async () => {
  });

});

describe("social_network::get_replies_by_last_update", async () => {
  it("social_network::get_replies_by_last_update", async () => {
  });

});

describe("social_network::get_content", async () => {
  it("social_network::get_content", async () => {
  });

});

describe("social_network::get_content_replies", async () => {
  it("social_network::get_content_replies", async () => {
  });

});

describe("social_network::get_all_content_replies", async () => {
  it("social_network::get_all_content_replies", async () => {
  });

});

describe("social_network::get_active_votes", async () => {
  it("social_network::get_active_votes", async () => {
  });

});

describe("social_network::get_account_votes", async () => {
  it("social_network::get_account_votes", async () => {
  });

});

describe("database_api::get_block_header", async () => {
  it("database_api::get_block_header", async () => {
  });

});

describe("database_api::get_block", async () => {
  it("database_api::get_block", async () => {
  });

});

describe("database_api::get_config", async () => {
  it("database_api::get_config", async () => {
  });

});

describe("database_api::get_dynamic_global_properties", async () => {
  it("database_api::get_dynamic_global_properties", async () => {
  });

});

describe("database_api::get_chain_properties", async () => {
  it("database_api::get_chain_properties", async () => {
  });

});

describe("database_api::get_hardfork_version", async () => {
  it("database_api::get_hardfork_version", async () => {
  });

});

describe("database_api::get_next_scheduled_hardfork", async () => {
  it("database_api::get_next_scheduled_hardfork", async () => {
  });

});

describe("database_api::get_account_count", async () => {
  it("database_api::get_account_count", async () => {
  });

});

describe("database_api::get_owner_history", async () => {
  it("database_api::get_owner_history", async () => {
  });

});

describe("database_api::get_recovery_request", async () => {
  it("database_api::get_recovery_request", async () => {
  });

});

describe("database_api::get_escrow", async () => {
  it("database_api::get_escrow", async () => {
  });

});

describe("database_api::get_withdraw_routes", async () => {
  it("database_api::get_withdraw_routes", async () => {
  });

});

describe("database_api::get_account_bandwidth", async () => {
  it("database_api::get_account_bandwidth", async () => {
  });

});

describe("database_api::get_savings_withdraw_from", async () => {
  it("database_api::get_savings_withdraw_from", async () => {
  });

});

describe("database_api::get_savings_withdraw_to", async () => {
  it("database_api::get_savings_withdraw_to", async () => {
  });

});

describe("database_api::get_conversion_requests", async () => {
  it("database_api::get_conversion_requests", async () => {
  });

});

describe("database_api::get_transaction_hex", async () => {
  it("database_api::get_transaction_hex", async () => {
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
  });

});

describe("database_api::get_vesting_delegations", async () => {
  it("database_api::get_vesting_delegations", async () => {
  });

});

describe("database_api::get_expiring_vesting_delegations", async () => {
  it("database_api::get_expiring_vesting_delegations", async () => {
  });

});

describe("follow::get_followers", async () => {
  it("follow::get_followers", async () => {
  });

});

describe("follow::get_following", async () => {
  it("follow::get_following", async () => {
  });

});

describe("follow::get_follow_count", async () => {
  it("follow::get_follow_count", async () => {
  });

});

describe("follow::get_feed_entries", async () => {
  it("follow::get_feed_entries", async () => {
  });

});

describe("follow::get_feed", async () => {
  it("follow::get_feed", async () => {
  });

});

describe("follow::get_blog_entries", async () => {
  it("follow::get_blog_entries", async () => {
  });

});

describe("follow::get_blog", async () => {
  it("follow::get_blog", async () => {
  });

});

describe("follow::get_account_reputations", async () => {
  it("follow::get_account_reputations", async () => {
  });

});

describe("follow::get_reblogged_by", async () => {
  it("follow::get_reblogged_by", async () => {
  });

});

describe("follow::get_blog_authors", async () => {
  it("follow::get_blog_authors", async () => {
  });

});

describe("account_by_key::get_key_references", async () => {
  it("account_by_key::get_key_references", async () => {
  });

});

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

describe("market_history::get_ticker", async () => {
  it("market_history::get_ticker", async () => {
  });

});

describe("market_history::get_volume", async () => {
  it("market_history::get_volume", async () => {
  });

});

describe("market_history::get_order_book", async () => {
  it("market_history::get_order_book", async () => {
  });

});

describe("market_history::get_order_book_extended", async () => {
  it("market_history::get_order_book_extended", async () => {
  });

});

describe("market_history::get_trade_history", async () => {
  it("market_history::get_trade_history", async () => {
  });

});

describe("market_history::get_recent_trades", async () => {
  it("market_history::get_recent_trades", async () => {
  });

});

describe("market_history::get_market_history", async () => {
  it("market_history::get_market_history", async () => {
  });

});

describe("market_history::get_market_history_buckets", async () => {
  it("market_history::get_market_history_buckets", async () => {
  });

});

describe("market_history::get_open_orders", async () => {
  it("market_history::get_open_orders", async () => {
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

