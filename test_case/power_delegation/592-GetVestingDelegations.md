https://github.com/GolosChain/golos/issues/592

1. Prepare stage
```
set_password 1qaz
unlock 1qaz
import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS
update_witness cyberfounder "http://url" GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "10.000 GOLOS"} true
publish_feed cyberfounder {"base": "1.000 GBG", "quote": "1.000 GOLOS"} true
```
2. Validate the price feed and the creation fee
```
info
```
3. Create user account "alice" with fee = account_creation_fee * 30
```
create_account cyberfounder alice "{}" "300.000 GOLOS" true
transfer cyberfounder alice "300.000 GOLOS" "{}" true
transfer_to_vesting cyberfounder alice "2000.000 GOLOS" true
```
4. Create user account "bob" with delegation fee * 30 * 5
```
create_account_delegated alice "10.000 GOLOS" "12600000.000000 GESTS" bob "{}" true
```
5. Check get_vesting_delegations
```
curl --data '{"method":"call","params":["database_api","get_vesting_delegations",["alice","bob"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_vesting_delegations",["bob","alice",10,"received"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
```
