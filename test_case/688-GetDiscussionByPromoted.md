https://github.com/GolosChain/golos/issues/541

1. Run daemon with enabled `tags`, `social_network` and `follow`
2. Wait HF 18
3. Run and prepare `cli_wallet`
```
set_password 1qaz
unlock 1qaz
import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS
```
4. Create account
```
create_account cyberfounder bob "{}" "3.000 GOLOS" true
```
5. Update chain properties
```
update_witness cyberfounder "http://url" GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "1.000 GOLOS"} true
```
6. Publish feed
```
publish_feed cyberfounder {"base": "1.000 GBG", "quote": "1.000 GOLOS"} true
```
7. Create post and vote on it
```
post_comment cyberfounder gbgpost "" gbg "GBG post!" "post…" "{}" true
vote cyberfounder cyberfounder gbgpost 100 true
```
8. Check balance of accounts
```
list_my_accounts

bob                     0.000 GOLOS         11646.179101 GESTS        0.000 GBG
cyberfounder     42576225.000 GOLOS        277554.281451 GESTS        0.000 GBG
-------------------------------------------------------------------------
TOTAL            42576225.000 GOLOS        289200.460552 GESTS        0.000 GBG
```
9. Wait one hour and check balance of accounts
```
list_my_accounts

bob                     0.000 GOLOS         11646.179101 GESTS        0.000 GBG
cyberfounder     42576225.000 GOLOS        277554.281451 GESTS       92.145 GBG
-------------------------------------------------------------------------
TOTAL            42576225.000 GOLOS        289200.460552 GESTS       92.145 GBG
```
10. Post from bob and promote it by cyberfounder
```
post_comment bob test "" test "Test post B!" "post B…" "{}" true
transfer cyberfounder "null" "1.000 GBG" "@bob/test" true
```
11. Get list of discussions by promoted and validate that list contains bob post:
```
#> curl --data '{"id":20,"method":"call","jsonrpc":"2.0","params":["tags","get_discussions_by_promoted",[{}]]}' http://127.0.0.1:8090/rpc  | python -mjson.tool | grep -P '"author"|"permlink"'

    "author": "bob",
    "permlink": "test",
```
