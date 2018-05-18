# Delegation of voting power
## Direct Delegation

### Basic:

1. Prepare stage
```
set_password 1qaz
unlock 1qaz
import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS
update_witness cyberfounder "http://url" GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "10.000 GOLOS"} true
publish_feed cyberfounder {"base": "1.000 GBG", "quote": "1.000 GOLOS"} true
```
1. Validate the price feed and the creation fee
```
info
```
1. Get balance of cyberfounder
```
get_account cyberfounder
```
1. Check error on trying to create user account "alice" with a small fee
```
create_account cyberfounder alice "{}" "3.000 GOLOS" true
```
1. Create user account "alice" with fee = account_creation_fee * 30
```
create_account cyberfounder alice "{}" "300.000 GOLOS" true
transfer cyberfounder alice "300.000 GOLOS" "{}" true
```
1. Сheck for existence of "alice" and check her balance
```
get_account alice
```
1. Check decreased balance of cyberfounder
```
get_account cyberfounder
```
1. Check error on trying to create user account "bob" with small delegation fee
```
create_account_delegated alice "10.000 GOLOS" "1.000000 GESTS" bob "{}" true
```
1. Create user account "bob" with delegation fee * 30 * 5
```
transfer_to_vesting cyberfounder alice "2000.000 GOLOS" true
create_account_delegated alice "10.000 GOLOS" "12600000.000000 GESTS" bob "{}" true
```
1. Check for existence of "bob" and he has received_vesting_rshares
```
get_account bob
```
1. Check "alice" has delegated_vesting_shares
```
get_account alice
```
1. Create account "dave"
```
create_account cyberfounder dave "{}" "300.000 GOLOS" true
transfer_to_vesting cyberfounder dave "300.000 GOLOS" true
```
1. Check account "dave"
```
get_account dave
```
1. Dave sends to bob some golos power
```
delegate_vesting_shares dave bob "900000.000000 GESTS" true

```
1. Check "bob" has increased received_vesting_rshares
```
get_account bob
```
1. Check "dave" has decreased delegated_vesting_shares
```
get_account dave
```
1. Check get_vesting_delegations
```
curl --data '{"method":"call","params":["database_api","get_vesting_delegations",["alice","bob"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_vesting_delegations",["bob","alice",10,"received"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
```
1. "alice" create post
```
post_comment alice test "" ptest "Test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{}" true
```
1. "bob" vote "alice" post
```
vote bob alice test 100 true
```
1. Dave requires the golos power back
```
delegate_vesting_shares dave bob "0.000000 GESTS" true
```
1. Check get_expiring_vesting_delegations
```
curl --data '{"method":"call","params":["database_api","get_expiring_vesting_delegations"["dave", "1970-01-01T00:00:00"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
```
1. Check that the golos power were returned to the dave at the end of delegation period
```
get_account dave
```
1. Check that the golos power were withdrawn from the bob
```
get_account bob
```
1. Check that the curation rewards are received by bob even after the end of delegation period
```
get_account_history bob -1 100
```
