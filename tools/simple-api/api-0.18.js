console.log(18);
API['0.18'] = {

paramFixes: {
    get_accounts: _csv2Arr,
    get_account_reputations: _csv2Arr,
    get_witnesses: _csv2Arr,

    // get_block_info: (from,n) => {return [{start_block_num:from, count:n}]},
    // get_blocks_with_info: (from,n) => {return [{start_block_num:from, count:n}]},

    get_discussions_by_trending:_str2Obj,
    get_discussions_by_created: _str2Obj,
    get_discussions_by_active:  _str2Obj,
    get_discussions_by_cashout: _str2Obj,
    get_discussions_by_payout:  _str2Obj,
    get_discussions_by_votes:   _str2Obj,
    get_discussions_by_children:_str2Obj,
    get_discussions_by_hot:     _str2Obj,
    get_discussions_by_feed:    _str2Obj,
    get_discussions_by_blog:    _str2Obj,
    get_discussions_by_comments:_str2Obj,
    get_discussions_by_promoted:_str2Obj,
},

methods: [
    {
        name: "block_info",
        methods: {
            get_block_info:         ['startBlockNum', 'count'],
            get_blocks_with_info:   ['startBlockNum', 'count']
        },
    },{
        name: "raw_block",
        methods: {
            get_raw_block:          ["blockNum"],
        },
    },{
        name: "database_api",
        methods: {
            //method: [params, ?optional]
            set_block_applied_callback: ["type"],
            set_pending_transaction_callback: [],

            get_block_header:       ["blockNum"],
            get_block:              ["blockNum"],
            get_config:             [],
            get_dynamic_global_properties:  [],
            get_chain_properties:   [],
            get_hardfork_version:   [],
            get_next_scheduled_hardfork:    [],
            get_accounts:           ["accounts"],
            get_account_references: ["accountId"],
            lookup_account_names:   ["accountNames"],
            lookup_accounts:        ["lowerBoundName", "limit"],
            get_account_count:      [],
            get_owner_history:      ["account"],
            get_recovery_request:   ["account"],
            get_escrow:             ["from", "escrowId"],
            get_withdraw_routes:    ["account", "?withdrawRouteType"],
            get_account_bandwidth:  ["account", "bandwidthType"],
            get_savings_withdraw_from:  ["account"],
            get_savings_withdraw_to:    ["account"],
            get_conversion_requests:    ["account"],
            get_transaction_hex:        ["trx"],
            get_required_signatures:    ["trx", "availableKeys"],
            get_potential_signatures:   ["trx"],
            verify_authority:           ["trx"],
            verify_account_authority:   ["name", "signers"],

            get_database_info:          [],
            get_vesting_delegations:    ["account", "from", "?limit", "?type"],
            get_expiring_vesting_delegations:   ["account", "from", "?limit"],
            get_proposed_transactions:  ["name", "from", "limit"],
        }
    },{
        name: "account_history",
        methods: {
            get_account_history:    ["account", "from", "limit"],
        }
    },{
        name: "operation_history",
        methods: {
            get_ops_in_block:       ["blockNum", "onlyVirtual"],
            get_transaction:        ["trxId"],
        }
    },{
        name: "witness_api",
        methods: {
            get_current_median_history_price: [],
            get_feed_history:       [],
            get_miner_queue:        [],
            get_active_witnesses:   [],
            get_witness_schedule:   [],
            get_witnesses:          ["witnessIds"],
            get_witness_by_account: ["accountName"],
            get_witnesses_by_vote:  ["from", "limit"],
            get_witness_count:      [],
            lookup_witness_accounts:["lowerBoundName", "limit"],
        }
    },{
        name: "account_by_key_api",
        methods: {
            get_key_references:     ["key"]
        }
    },{
        name: "social_network",
        methods: {
            get_content:            ["author", "permlink", "?voteLimit"],
            get_content_replies:    ["author", "permlink", "?voteLimit"],
            get_all_content_replies:["author", "permlink", "?voteLimit"],
            get_active_votes:       ["author", "permlink", "?limit"],
            get_account_votes:      ["voter", "?from", "?limit"],
            get_replies_by_last_update: ["startAuthor", "startPermlink", "limit", "?voteLimit"],
        }
    },{
        name: "tags",
        methods: {
            get_languages:              [],
            get_discussions_by_blog:    ["query"],
            get_discussions_by_feed:    ["query"],
            get_discussions_by_comments:["query"],
            get_discussions_by_trending:["query"],
            get_discussions_by_promoted:["query"],
            get_discussions_by_created: ["query"],
            get_discussions_by_active:  ["query"],
            get_discussions_by_cashout: ["query"],
            get_discussions_by_payout:  ["query"],
            get_discussions_by_votes:   ["query"],
            get_discussions_by_children:["query"],
            get_discussions_by_hot:     ["query"],
            get_discussions_by_author_before_date: ["author", "startPermlink", "beforeDate", "limit", "?voteLimit"],
            get_trending_tags:          ["afterTag", "limit"],
            get_tags_used_by_author:    ["author"],
        }
    },{
        name: "follow",
        methods: {
            get_followers:      ["following", "startFollower", "followType", "limit"],
            get_following:      ["follower", "startFollowing", "followType", "limit"],
            get_follow_count:   ["account"],
            get_feed_entries:   ["account", "entryId", "limit"],
            get_feed:           ["account", "entryId", "limit"],
            get_blog_entries:   ["account", "entryId", "limit"],
            get_blog:           ["account", "entryId", "limit"],
            get_account_reputations: ["accounts"],
            get_reblogged_by:   ["author", "permlink"],
            get_blog_authors:   ["blogAccount"],
        }
    },{
        name: "network_broadcast_api",
        methods: {
            broadcast_transaction:  ["trx", "?maxBlockAge"],
            broadcast_transaction_synchronous:  ["trx", "?maxBlockAge"],
            broadcast_transaction_with_callback:["confirmationCallback", "trx", "?maxBlockAge"],
            broadcast_block:        ["block"],
        }
    },{
        name: "market_history",
        methods: {
            get_ticker:             [],
            get_volume:             [],
            get_order_book:         ["limit"],
            get_order_book_extended:["limit"],
            get_trade_history:      ["start", "end", "limit"],
            get_recent_trades:      ["limit"],
            get_market_history:     ["bucketSeconds" , "start", "end"],
            get_market_history_buckets: [],
            get_open_orders:        ["owner"],
        }
    },{
        name: "private_message",
        methods: {
            get_inbox:      ["to", "newest", "limit", "offset"],
            get_outbox:     ["from", "newest", "limit", "offset"],
        }
    },{
        name: "auth_util",
        methods: {
            check_authority_signature: ["accountName", "level", "dig", "sigs"]
        }
    },{
        name: "debug_node",
        methods: {
            debug_generate_blocks:  ["debugKey", "?count", "?skip", "?missBlocks", "?editIfNeeded"],
            debug_push_blocks:      ["srcFilename", "count", "?skipValidateInvariants"],
            debug_push_json_blocks: ["srcFilename", "count", "?skipFlags"],
            debug_generate_blocks_until:    ["debugKey", "headBlockTime", "?generateSparsely", "?skip"],
            debug_pop_block:        [],
            debug_get_witness_schedule:     [],
            debug_set_hardfork:     ["hardforkId"],
            debug_has_hardfork:     ["hardforkId"],
        }
    }
]
};
