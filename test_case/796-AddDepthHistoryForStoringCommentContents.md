
# 796 Add depth history for storing comment contents #
## Description ##
GolosChain had a scpecial building key `LOW_MEMORY` which used to reduce memory usage.
But it has been too inconvenient and had no parameters to changes the settings.
Thus we've decided to add more flexible parameters to store content only needed period of time.

There were added 3 optional parameters about depth history for storing content:
- Title depth `comment-title-depth`
- Body depth `comment-body-depth`
- Json_metadata depth `comment-json-metadata-depth`

Also there was added one more parameter `set-content-storing-depth-null-after-update` which is needed for case
when node owner wants to store comment (or post) content after it was updated. So if this parameter is set true, then
after comment (post) update it's content depth will be set 0.

Also `comment_content_index` was moved to `social_network` plugin.

## Test cases ##
There are few main cases to test:
- The depth is not defined at all
    In this case everything about content stroing must work exactly as in 18.3
    cli_wallet:
    ```
        create_account cyberfounder alice "{}" "300.000 GOLOS" true
        post_comment alice test "" test "test post!" "post…" "{}" true
    ```
    api calls:
    ```
    curl --data '{"method":"call","params":["social_network", "get_content", ["alice","test"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
    ```
    excepted result:
    ```
    {
        "id": 0,
        "jsonrpc": "2.0",
        "result": {
            ....
            "body": "post\u2026",
            ...
            "json_metadata": "{}",
            ...
            "title": "test post!",
            ...
        }
    }
    ```
- All three parameters are set to zero
    That means that content haven't be saved at all.
    Add this to `config.ini`:
    ```
    comment-title-depth = 0
    comment-body-depth = 0
    comment-json-metadata-depth = 0
    ```

    next run following commands in cli_wallet:
    ```
    create_account cyberfounder bob "{}" "300.000 GOLOS" true
    post_comment bob test2 "" test2 "test post!" "post…" "{}" true
    ```

    api call:
    ```
    curl --data '{"method":"call","params":["social_network", "get_content", ["bob","test2"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
    ```
    Excepted result:
    ```
        {
        "id": 0,
        "jsonrpc": "2.0",
        "result": {
            "abs_rshares": 0,
            "active": "2018-07-17T11:58:06",
            "active_votes": [],
            "active_votes_count": 0,
            "allow_curation_rewards": true,
            "allow_replies": true,
            "allow_votes": true,
            "author": "bob",
            "author_reputation": 0,
            "author_rewards": 0,
            "beneficiaries": [],
            "body": "",
            "body_length": 0,
            "cashout_time": "2018-07-17T12:01:06",
            "category": "test2",
            "children": 0,
            "children_abs_rshares": 0,
            "children_rshares2": "0",
            "created": "2018-07-17T11:58:06",
            "curator_payout_value": "0.000 GBG",
            "depth": 0,
            "id": 1,
            "json_metadata": "",
            "last_payout": "1970-01-01T00:00:00",
            "last_update": "2018-07-17T11:58:06",
            "max_accepted_payout": "1000000.000 GBG",
            "max_cashout_time": "1969-12-31T23:59:59",
            "mode": "first_payout",
            "net_rshares": 0,
            "net_votes": 0,
            "parent_author": "",
            "parent_permlink": "test2",
            "pending_payout_value": "0.000 GBG",
            "percent_steem_dollars": 10000,
            "permlink": "test2",
            "promoted": "0.000 GBG",
            "reblogged_by": [],
            "replies": [],
            "reward_weight": 10000,
            "root_comment": 1,
            "root_title": "",
            "title": "",
            "total_payout_value": "0.000 GBG",
            "total_pending_payout_value": "0.000 GBG",
            "total_vote_weight": 0,
            "url": "/test2/@bob/test2",
            "vote_rshares": 0
        }
    }
    ```

- Some of depth parameters are set and other are not
    As in all cases when any depth parameter has non-zero value, then it mush be stored till the end of cashout_window.
    First set #define `STEEMIT_CASHOUT_WINDOW_SECONDS          (60*3) /// 3 minutes` instead of
    `#define STEEMIT_CASHOUT_WINDOW_SECONDS          (60*60) /// 1 hour`
    to don't wait for an hour to test.

    Then lets take for example title_depth = 20, which means that after 3 sec * 20 blocks = 60 secons content can be removed, but
    as cashout_window hasn't came yet it can't be removed.

    1. First lets test when `depth * 3 < STEEMIT_CASHOUT_WINDOW_SECONDS`
        Thus first lets set parameter `comment-title-depth = 20`
        Then 
        ```
        create_account cyberfounder james "{}" "300.000 GOLOS" true
        post_comment james test3 "" test3 "james test post!" "lorem ipsum post…" "{}" true
        ```

        make following api call three times:

        ```
        curl --data '{"method":"call","params":["social_network", "get_content", ["james","test3"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
        ```
        P.S. Also Look at cashout time and created_time.

        - Right after creatring
            ```
            {
                "id": 0,
                "jsonrpc": "2.0",
                "result": {
                    "abs_rshares": 0,
                    "active": "2018-07-17T12:05:39",
                    "active_votes": [],
                    "active_votes_count": 0,
                    "allow_curation_rewards": true,
                    "allow_replies": true,
                    "allow_votes": true,
                    "author": "james",
                    "author_reputation": 0,
                    "author_rewards": 0,
                    "beneficiaries": [],
                    "body": "lorem ipsum post\u2026",
                    "body_length": 0,
                    "cashout_time": "2018-07-17T12:08:39",
                    "category": "test3",
                    "children": 0,
                    "children_abs_rshares": 0,
                    "children_rshares2": "0",
                    "created": "2018-07-17T12:05:39",
                    "curator_payout_value": "0.000 GBG",
                    "depth": 0,
                    "id": 2,
                    "json_metadata": "{}",
                    "last_payout": "1970-01-01T00:00:00",
                    "last_update": "2018-07-17T12:05:39",
                    "max_accepted_payout": "1000000.000 GBG",
                    "max_cashout_time": "1969-12-31T23:59:59",
                    "mode": "first_payout",
                    "net_rshares": 0,
                    "net_votes": 0,
                    "parent_author": "",
                    "parent_permlink": "test3",
                    "pending_payout_value": "0.000 GBG",
                    "percent_steem_dollars": 10000,
                    "permlink": "test3",
                    "promoted": "0.000 GBG",
                    "reblogged_by": [],
                    "replies": [],
                    "reward_weight": 10000,
                    "root_comment": 2,
                    "root_title": "james test post!",
                    "title": "james test post!",
                    "total_payout_value": "0.000 GBG",
                    "total_pending_payout_value": "0.000 GBG",
                    "total_vote_weight": 0,
                    "url": "/test3/@james/test3",
                    "vote_rshares": 0
                }
            }



        - Right after 20 blocks:
            ```
            {
                "id": 0,
                "jsonrpc": "2.0",
                "result": {
                    "abs_rshares": 0,
                    "active": "2018-07-17T12:05:39",
                    "active_votes": [],
                    "active_votes_count": 0,
                    "allow_curation_rewards": true,
                    "allow_replies": true,
                    "allow_votes": true,
                    "author": "james",
                    "author_reputation": 0,
                    "author_rewards": 0,
                    "beneficiaries": [],
                    "body": "lorem ipsum post\u2026",
                    "body_length": 0,
                    "cashout_time": "2018-07-17T12:08:39",
                    "category": "test3",
                    "children": 0,
                    "children_abs_rshares": 0,
                    "children_rshares2": "0",
                    "created": "2018-07-17T12:05:39",
                    "curator_payout_value": "0.000 GBG",
                    "depth": 0,
                    "id": 2,
                    "json_metadata": "{}",
                    "last_payout": "1970-01-01T00:00:00",
                    "last_update": "2018-07-17T12:05:39",
                    "max_accepted_payout": "1000000.000 GBG",
                    "max_cashout_time": "1969-12-31T23:59:59",
                    "mode": "first_payout",
                    "net_rshares": 0,
                    "net_votes": 0,
                    "parent_author": "",
                    "parent_permlink": "test3",
                    "pending_payout_value": "0.000 GBG",
                    "percent_steem_dollars": 10000,
                    "permlink": "test3",
                    "promoted": "0.000 GBG",
                    "reblogged_by": [],
                    "replies": [],
                    "reward_weight": 10000,
                    "root_comment": 2,
                    "root_title": "james test post!",
                    "title": "james test post!",
                    "total_payout_value": "0.000 GBG",
                    "total_pending_payout_value": "0.000 GBG",
                    "total_vote_weight": 0,
                    "url": "/test3/@james/test3",
                    "vote_rshares": 0
                }
            }
        - Right after end of cashout_window
            ```
            {
                "id": 0,
                "jsonrpc": "2.0",
                "result": {
                    "abs_rshares": 0,
                    "active": "2018-07-17T12:05:39",
                    "active_votes": [],
                    "active_votes_count": 0,
                    "allow_curation_rewards": true,
                    "allow_replies": true,
                    "allow_votes": true,
                    "author": "james",
                    "author_reputation": 0,
                    "author_rewards": 0,
                    "beneficiaries": [],
                    "body": "",
                    "body_length": 0,
                    "cashout_time": "1969-12-31T23:59:59",
                    "category": "test3",
                    "children": 0,
                    "children_abs_rshares": 0,
                    "children_rshares2": "0",
                    "created": "2018-07-17T12:05:39",
                    "curator_payout_value": "0.000 GBG",
                    "depth": 0,
                    "id": 2,
                    "json_metadata": "",
                    "last_payout": "2018-07-17T12:08:39",
                    "last_update": "2018-07-17T12:05:39",
                    "max_accepted_payout": "1000000.000 GBG",
                    "max_cashout_time": "1969-12-31T23:59:59",
                    "mode": "archived",
                    "net_rshares": 0,
                    "net_votes": 0,
                    "parent_author": "",
                    "parent_permlink": "test3",
                    "pending_payout_value": "0.000 GBG",
                    "percent_steem_dollars": 10000,
                    "permlink": "test3",
                    "promoted": "0.000 GBG",
                    "reblogged_by": [],
                    "replies": [],
                    "reward_weight": 10000,
                    "root_comment": 2,
                    "root_title": "",
                    "title": "",
                    "total_payout_value": "0.000 GBG",
                    "total_pending_payout_value": "0.000 GBG",
                    "total_vote_weight": 0,
                    "url": "/test3/@james/test3",
                    "vote_rshares": 0
                }
            }

            ```

    2. Next when `depth * 3 > STEEMIT_CASHOUT_WINDOW_SECONDS`
        Set `comment-title-depth = 65`

        ```
        create_account cyberfounder michael "{}" "300.000 GOLOS" true
        post_comment michael test4 "" test4 "michael test post!" "lorem michael ipsum post…" "{}" true
        ```

        make following api call two times:

        ```
        curl --data '{"method":"call","params":["social_network", "get_content", ["michael","test4"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
        ```

        - Right after creatring
            ```
            {
                "id": 0,
                "jsonrpc": "2.0",
                "result": {
                    "abs_rshares": 0,
                    "active": "2018-07-17T12:24:18",
                    "active_votes": [],
                    "active_votes_count": 0,
                    "allow_curation_rewards": true,
                    "allow_replies": true,
                    "allow_votes": true,
                    "author": "michael",
                    "author_reputation": 0,
                    "author_rewards": 0,
                    "beneficiaries": [],
                    "body": "lorem michael ipsum post\u2026",
                    "body_length": 0,
                    "cashout_time": "2018-07-17T12:27:18",
                    "category": "test4",
                    "children": 0,
                    "children_abs_rshares": 0,
                    "children_rshares2": "0",
                    "created": "2018-07-17T12:24:18",
                    "curator_payout_value": "0.000 GBG",
                    "depth": 0,
                    "id": 3,
                    "json_metadata": "{}",
                    "last_payout": "1970-01-01T00:00:00",
                    "last_update": "2018-07-17T12:24:18",
                    "max_accepted_payout": "1000000.000 GBG",
                    "max_cashout_time": "1969-12-31T23:59:59",
                    "mode": "first_payout",
                    "net_rshares": 0,
                    "net_votes": 0,
                    "parent_author": "",
                    "parent_permlink": "test4",
                    "pending_payout_value": "0.000 GBG",
                    "percent_steem_dollars": 10000,
                    "permlink": "test4",
                    "promoted": "0.000 GBG",
                    "reblogged_by": [],
                    "replies": [],
                    "reward_weight": 10000,
                    "root_comment": 3,
                    "root_title": "michael test post!",
                    "title": "michael test post!",
                    "total_payout_value": "0.000 GBG",
                    "total_pending_payout_value": "0.000 GBG",
                    "total_vote_weight": 0,
                    "url": "/test4/@michael/test4",
                    "vote_rshares": 0
                }
            }

        - Right after 65 blocks:
            ```
            {
                "id": 0,
                "jsonrpc": "2.0",
                "result": {
                    "abs_rshares": 0,
                    "active": "2018-07-17T12:05:39",
                    "active_votes": [],
                    "active_votes_count": 0,
                    "allow_curation_rewards": true,
                    "allow_replies": true,
                    "allow_votes": true,
                    "author": "james",
                    "author_reputation": 0,
                    "author_rewards": 0,
                    "beneficiaries": [],
                    "body": "",
                    "body_length": 0,
                    "cashout_time": "1969-12-31T23:59:59",
                    "category": "test3",
                    "children": 0,
                    "children_abs_rshares": 0,
                    "children_rshares2": "0",
                    "created": "2018-07-17T12:05:39",
                    "curator_payout_value": "0.000 GBG",
                    "depth": 0,
                    "id": 2,
                    "json_metadata": "",
                    "last_payout": "2018-07-17T12:08:39",
                    "last_update": "2018-07-17T12:05:39",
                    "max_accepted_payout": "10\00000.000 GBG",
                    "max_cashout_time": "1969-12-31T23:59:59",
                    "mode": "archived",
                    "net_rshares": 0,
                    "net_votes": 0,
                    "parent_author": "",
                    "parent_permlink": "test3",
                    "pending_payout_value": "0.000 GBG",
                    "percent_steem_dollars": 10000,
                    "permlink": "test3",
                    "promoted": "0.000 GBG",
                    "reblogged_by": [],
                    "replies": [],
                    "reward_weight": 10000,
                    "root_comment": 2,
                    "root_title": "",
                    "title": "",
                    "total_payout_value": "0.000 GBG",
                    "total_pending_payout_value": "0.000 GBG",
                    "total_vote_weight": 0,
                    "url": "/test3/@james/test3",
                    "vote_rshares": 0
                }
            }

- All three parameters are set and have to non-zero value
    1. All three parameters are equal
        Lets set them to 80 blocks:

        ```
        comment-title-depth = 80
        comment-body-depth = 80
        comment-json-metadata-depth = 80
        ```

        Then create post and wait till it will be deleted.

        ```
        create_account cyberfounder hansolo "{}" "300.000 GOLOS" true
        post_comment hansolo test4 "" test4 "han_solo title!" "piu  piu piu !!!" "{}" true
        ```

        ```
        curl --data '{"method":"call","params":["social_network", "get_content", ["hansolo","test4"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
        ```
        
        ```
        {
            "id": 0,
            "jsonrpc": "2.0",
            "result": {
                "abs_rshares": 0,
                "active": "2018-07-17T12:30:48",
                "active_votes": [],
                "active_votes_count": 0,
                "allow_curation_rewards": true,
                "allow_replies": true,
                "allow_votes": true,
                "author": "hansolo",
                "author_reputation": 0,
                "author_rewards": 0,
                "beneficiaries": [],
                "body": "piu  piu piu !!!",
                "body_length": 0,
                "cashout_time": "1969-12-31T23:59:59",
                "category": "test4",
                "children": 0,
                "children_abs_rshares": 0,
                "children_rshares2": "0",
                "created": "2018-07-17T12:30:48",
                "curator_payout_value": "0.000 GBG",
                "depth": 0,
                "id": 4,
                "json_metadata": "{}",
                "last_payout": "2018-07-17T12:33:48",
                "last_update": "2018-07-17T12:30:48",
                "max_accepted_payout": "1000000.000 GBG",
                "max_cashout_time": "1969-12-31T23:59:59",
                "mode": "archived",
                "net_rshares": 0,
                "net_votes": 0,
                "parent_author": "",
                "parent_permlink": "test4",
                "pending_payout_value": "0.000 GBG",
                "percent_steem_dollars": 10000,
                "permlink": "test4",
                "promoted": "0.000 GBG",
                "reblogged_by": [],
                "replies": [],
                "reward_weight": 10000,
                "root_comment": 4,
                "root_title": "han_solo title!",
                "title": "han_solo title!",
                "total_payout_value": "0.000 GBG",
                "total_pending_payout_value": "0.000 GBG",
                "total_vote_weight": 0,
                "url": "/test4/@hansolo/test4",
                "vote_rshares": 0
            }
        }
        ```
        
        After `80 * 3` seconds result:
        ```
        {
            "id": 0,
            "jsonrpc": "2.0",
            "result": {
                "abs_rshares": 0,
                "active": "2018-07-17T12:30:48",
                "active_votes": [],
                "active_votes_count": 0,
                "allow_curation_rewards": true,
                "allow_replies": true,
                "allow_votes": true,
                "author": "hansolo",
                "author_reputation": 0,
                "author_rewards": 0,
                "beneficiaries": [],
                "body": "piu  piu piu !!!",
                "body_length": 0,
                "cashout_time": "1969-12-31T23:59:59",
                "category": "test4",
                "children": 0,
                "children_abs_rshares": 0,
                "children_rshares2": "0",
                "created": "2018-07-17T12:30:48",
                "curator_payout_value": "0.000 GBG",
                "depth": 0,
                "id": 4,
                "json_metadata": "{}",
                "last_payout": "2018-07-17T12:33:48",
                "last_update": "2018-07-17T12:30:48",
                "max_accepted_payout": "1000000.000 GBG",
                "max_cashout_time": "1969-12-31T23:59:59",
                "mode": "archived",
                "net_rshares": 0,
                "net_votes": 0,
                "parent_author": "",
                "parent_permlink": "test4",
                "pending_payout_value": "0.000 GBG",
                "percent_steem_dollars": 10000,
                "permlink": "test4",
                "promoted": "0.000 GBG",
                "reblogged_by": [],
                "replies": [],
                "reward_weight": 10000,
                "root_comment": 4,
                "root_title": "han_solo title!",
                "title": "han_solo title!",
                "total_payout_value": "0.000 GBG",
                "total_pending_payout_value": "0.000 GBG",
                "total_vote_weight": 0,
                "url": "/test4/@hansolo/test4",
                "vote_rshares": 0
            }
        }

        ```
    2. Some parameters may differ and some part of content should be deleted in different time
        Lets set 
        ```
        comment-title-depth = 80
        comment-body-depth = 20
        comment-json-metadata-depth = 3
        ```

        ```
        create_account cyberfounder chewbacca "{}" "300.000 GOLOS" true
        post_comment chewbacca test5 "" test5 "chewbacca title!" "Aggrrrrrr!!!" "{}" true
        ```
        
        ```
        curl --data '{"method":"call","params":["social_network", "get_content", ["chewbacca","test5"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
        ```

        After creating:
        ```
        {
            "id": 0,
            "jsonrpc": "2.0",
            "result": {
                "abs_rshares": 0,
                "active": "2018-07-17T12:36:54",
                "active_votes": [],
                "active_votes_count": 0,
                "allow_curation_rewards": true,
                "allow_replies": true,
                "allow_votes": true,
                "author": "chewbacca",
                "author_reputation": 0,
                "author_rewards": 0,
                "beneficiaries": [],
                "body": "Aggrrrrrr!!!",
                "body_length": 0,
                "cashout_time": "2018-07-17T12:39:54",
                "category": "test5",
                "children": 0,
                "children_abs_rshares": 0,
                "children_rshares2": "0",
                "created": "2018-07-17T12:36:54",
                "curator_payout_value": "0.000 GBG",
                "depth": 0,
                "id": 5,
                "json_metadata": "{}",
                "last_payout": "1970-01-01T00:00:00",
                "last_update": "2018-07-17T12:36:54",
                "max_accepted_payout": "1000000.000 GBG",
                "max_cashout_time": "1969-12-31T23:59:59",
                "mode": "first_payout",
                "net_rshares": 0,
                "net_votes": 0,
                "parent_author": "",
                "parent_permlink": "test5",
                "pending_payout_value": "0.000 GBG",
                "percent_steem_dollars": 10000,
                "permlink": "test5",
                "promoted": "0.000 GBG",
                "reblogged_by": [],
                "replies": [],
                "reward_weight": 10000,
                "root_comment": 5,
                "root_title": "chewbacca title!",
                "title": "chewbacca title!",
                "total_payout_value": "0.000 GBG",
                "total_pending_payout_value": "0.000 GBG",
                "total_vote_weight": 0,
                "url": "/test5/@chewbacca/test5",
                "vote_rshares": 0
            }
        }
        ```
        After cashout window
        ```
        {
            "id": 0,
            "jsonrpc": "2.0",
            "result": {
                "abs_rshares": 0,
                "active": "2018-07-17T12:05:39",
                "active_votes": [],
                "active_votes_count": 0,
                "allow_curation_rewards": true,
                "allow_replies": true,
                "allow_votes": true,
                "author": "james",
                "author_reputation": 0,
                "author_rewards": 0,
                "beneficiaries": [],
                "body": "",
                "body_length": 0,
                "cashout_time": "1969-12-31T23:59:59",
                "category": "test3",
                "children": 0,
                "children_abs_rshares": 0,
                "children_rshares2": "0",
                "created": "2018-07-17T12:05:39",
                "curator_payout_value": "0.000 GBG",
                "depth": 0,
                "id": 2,
                "json_metadata": "",
                "last_payout": "2018-07-17T12:08:39",
                "last_update": "2018-07-17T12:05:39",
                "max_accepted_payout": "1000000.000 GBG",
                "max_cashout_time": "1969-12-31T23:59:59",
                "mode": "archived",
                "net_rshares": 0,
                "net_votes": 0,
                "parent_author": "",
                "parent_permlink": "test3",
                "pending_payout_value": "0.000 GBG",
                "percent_steem_dollars": 10000,
                "permlink": "test3",
                "promoted": "0.000 GBG",
                "reblogged_by": [],
                "replies": [],
                "reward_weight": 10000,
                "root_comment": 2,
                "root_title": "chewbacca title!",
                "title": "chewbacca title!",
                "total_payout_value": "0.000 GBG",
                "total_pending_payout_value": "0.000 GBG",
                "total_vote_weight": 0,
                "url": "/test3/@james/test3",
                "vote_rshares": 0
            }
        }

        ```

        After `80 * 3` seconds 
        ```
                {
            "id": 0,
            "jsonrpc": "2.0",
            "result": {
                "abs_rshares": 0,
                "active": "2018-07-17T12:05:39",
                "active_votes": [],
                "active_votes_count": 0,
                "allow_curation_rewards": true,
                "allow_replies": true,
                "allow_votes": true,
                "author": "james",
                "author_reputation": 0,
                "author_rewards": 0,
                "beneficiaries": [],
                "body": "",
                "body_length": 0,
                "cashout_time": "1969-12-31T23:59:59",
                "category": "test3",
                "children": 0,
                "children_abs_rshares": 0,
                "children_rshares2": "0",
                "created": "2018-07-17T12:05:39",
                "curator_payout_value": "0.000 GBG",
                "depth": 0,
                "id": 2,
                "json_metadata": "",
                "last_payout": "2018-07-17T12:08:39",
                "last_update": "2018-07-17T12:05:39",
                "max_accepted_payout": "1000000.000 GBG",
                "max_cashout_time": "1969-12-31T23:59:59",
                "mode": "archived",
                "net_rshares": 0,
                "net_votes": 0,
                "parent_author": "",
                "parent_permlink": "test3",
                "pending_payout_value": "0.000 GBG",
                "percent_steem_dollars": 10000,
                "permlink": "test3",
                "promoted": "0.000 GBG",
                "reblogged_by": [],
                "replies": [],
                "reward_weight": 10000,
                "root_comment": 2,
                "root_title": "",
                "title": "",
                "total_payout_value": "0.000 GBG",
                "total_pending_payout_value": "0.000 GBG",
                "total_vote_weight": 0,
                "url": "/test3/@james/test3",
                "vote_rshares": 0
            }
        }
        ```
- Added option `set-content-storing-depth-null-after-update`
    Lets set all three parameters equal to 30 and set `set-content-storing-depth-null-after-update = true`

    ```
    comment-title-depth = 30
    comment-body-depth = 30
    comment-json-metadata-depth = 30
    set-content-storing-depth-null-after-update = true
    ```

    ```
    create_account cyberfounder r2d2 "{}" "300.000 GOLOS" true
    post_comment r2d2 test42 "" test42 "R2D2 post!" "48656c6c6f2c20456174686c696e677321" "{}" true
    ```

    ```
    curl --data '{"method":"call","params":["social_network", "get_content", ["r2d2","test42"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
    ```

    Wait some time (less that `30 * 3` seconds) and update post:
    ```
    post_comment r2d2 test42 "" test42 "R2D2 post!" "48656c6c6f2c20456174686c696e677321 ha ha ha" "{}" true
    ```

    After cashout_window end:
    ```
    {
        "id": 0,
        "jsonrpc": "2.0",
        "result": {
            "abs_rshares": 0,
            "active": "2018-07-17T12:45:06",
            "active_votes": [],
            "active_votes_count": 0,
            "allow_curation_rewards": true,
            "allow_replies": true,
            "allow_votes": true,
            "author": "r2d2",
            "author_reputation": 0,
            "author_rewards": 0,
            "beneficiaries": [],
            "body": "48656c6c6f2c20456174686c696e677321 ha ha ha",
            "body_length": 0,
            "cashout_time": "2018-07-17T12:46:27",
            "category": "test42",
            "children": 0,
            "children_abs_rshares": 0,
            "children_rshares2": "0",
            "created": "2018-07-17T12:43:27",
            "curator_payout_value": "0.000 GBG",
            "depth": 0,
            "id": 6,
            "json_metadata": "{}",
            "last_payout": "1970-01-01T00:00:00",
            "last_update": "2018-07-17T12:45:06",
            "max_accepted_payout": "1000000.000 GBG",
            "max_cashout_time": "1969-12-31T23:59:59",
            "mode": "first_payout",
            "net_rshares": 0,
            "net_votes": 0,
            "parent_author": "",
            "parent_permlink": "test42",
            "pending_payout_value": "0.000 GBG",
            "percent_steem_dollars": 10000,
            "permlink": "test42",
            "promoted": "0.000 GBG",
            "reblogged_by": [],
            "replies": [],
            "reward_weight": 10000,
            "root_comment": 6,
            "root_title": "R2D2 post!",
            "title": "R2D2 post!",
            "total_payout_value": "0.000 GBG",
            "total_pending_payout_value": "0.000 GBG",
            "total_vote_weight": 0,
            "url": "/test42/@r2d2/test42",
            "vote_rshares": 0
        }
    }
    ```
    
    After second `30 * 3` seconds after post update 
    ```
    {
        "id": 0,
        "jsonrpc": "2.0",
        "result": {
            "abs_rshares": 0,
            "active": "2018-07-17T12:45:06",
            "active_votes": [],
            "active_votes_count": 0,
            "allow_curation_rewards": true,
            "allow_replies": true,
            "allow_votes": true,
            "author": "r2d2",
            "author_reputation": 0,
            "author_rewards": 0,
            "beneficiaries": [],
            "body": "",
            "body_length": 0,
            "cashout_time": "1969-12-31T23:59:59",
            "category": "test42",
            "children": 0,
            "children_abs_rshares": 0,
            "children_rshares2": "0",
            "created": "2018-07-17T12:43:27",
            "curator_payout_value": "0.000 GBG",
            "depth": 0,
            "id": 6,
            "json_metadata": "",
            "last_payout": "2018-07-17T12:46:27",
            "last_update": "2018-07-17T12:45:06",
            "max_accepted_payout": "1000000.000 GBG",
            "max_cashout_time": "1969-12-31T23:59:59",
            "mode": "archived",
            "net_rshares": 0,
            "net_votes": 0,
            "parent_author": "",
            "parent_permlink": "test42",
            "pending_payout_value": "0.000 GBG",
            "percent_steem_dollars": 10000,
            "permlink": "test42",
            "promoted": "0.000 GBG",
            "reblogged_by": [],
            "replies": [],
            "reward_weight": 10000,
            "root_comment": 6,
            "root_title": "",
            "title": "",
            "total_payout_value": "0.000 GBG",
            "total_pending_payout_value": "0.000 GBG",
            "total_vote_weight": 0,
            "url": "/test42/@r2d2/test42",
            "vote_rshares": 0
        }
    }

    ```
