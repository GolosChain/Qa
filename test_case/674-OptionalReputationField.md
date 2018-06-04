https://github.com/GolosChain/golos/issues/674


*Note: GBG needed for this test. If your cyberfounder have none,
then create post, vote for it and wait cashout. (You need price feed set for it)*
```
update_witness cyberfounder "http://url" GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "1.000 GOLOS"} true
publish_feed cyberfounder {"base": "1.000 GBG", "quote": "1.000 GOLOS"} true
post_comment cyberfounder gbg674 "" gbg "GBG post!" "post…" "{}" true
vote cyberfounder cyberfounder gbg674 100 true
```

### 0. Prepare

0. Create fresh accounts having no reputation
```
create_account cyberfounder a674 "" "30.000 GOLOS" true
create_account cyberfounder b674 "" "30.000 GOLOS" true
post_comment a674 test674 "" test "Test post A!" "post A…" "{}" true
post_comment b674 test674 "" test "Test post B!" "post B…" "{}" true
```

### 1. Tests with `follow` and `tags` plugins enabled

1. Vote for post A and check `a674` account have nonzero reputation and `b674` account have 0 reputation
```
vote cyberfounder a674 test674 100 true
get_account a674
get_account b674
```

2. Check reputation changed in `get_account_reputations`
    * api: `get_account_reputations a674,b674,non-exist,123bad`

3. Promote post B and check it's visible in `get_content`
```
transfer cyberfounder "null" "1.000 GBG" "@b674/test674" true
```
    * api: `get_content a647 test674` .promoted should be 0
    * api: `get_content b647 test674` .promoted should be 1 GBG
    * api: `get_discussions_by_promoted {"select_authors":["a674","b674"]}` should return only post by b674

### 2. Disable `follow` plugin and restart node

4. Check that there is no reputation field
```
get_account a674
get_account b674
```

5. Promoted should not change
    * api: `get_content a647 test674` promoted should be 0
    * api: `get_content b647 test674` promoted should be 1 GBG
    * api: `get_discussions_by_promoted {"select_authors":["a674","b674"]}` should return only post by b674

### 3. Disable `tags` plugin and restart node

6. Check that there is no more promoted field
    * api: `get_content a647 test674` promoted should be 0
    * api: `get_content b647 test674` promoted should be 1 GBG
