https://github.com/GolosChain/golos/issues/196

1. Run daemon
2. Wait HF 18
3. Run and prepare `cli_wallet`
```
set_password 1qaz
unlock 1qaz
import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS
```
4. Get record counts from database
```
curl --data '{"method":"call","params":["database_api","get_database_info",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool | grep -A 2 -P "account_metadata_object|account_object"
```
5. Create user profile
```
create_account cyberfounder profile "{\"name\":\"profile\"}" "300.000 GOLOS" true
```
6. Validate that account has json metadata:
```
curl --data '{"method":"call","params":["database_api","get_accounts",[["profile"]]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool  | grep json_metadata
```
7. Validate that record counts in database has increased:
```
curl --data '{"method":"call","params":["database_api","get_database_info",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool | grep -A 2 -P "account_metadata_object|account_object"
```
8. Update json metadata:
```
update_account_meta profile "{\"name\":\"update\"}" true
```
9. Validate json metadata has changed:
```
curl --data '{"method":"call","params":["database_api","get_accounts",[["profile"]]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool  | grep json_metadata
```
10. Get prototype for `account_metadata_operation`
```
get_prototype_operation account_metadata_operation
```
11. Construct transaction with builder
```
begin_builder_transaction
add_operation_to_builder_transaction 0 ["account_metadata_operation", {"account":"profile", "json_metadata":"{\"name\":\"builder\"}"}]
```
12. Preview transaction
```
preview_builder_transaction 0
```
13. Sign transaction from builder
```
sign_builder_transaction 0 true
```
14. Validate json metadata has changed
```
curl --data '{"method":"call","params":["database_api","get_accounts",[["profile"]]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool  | grep json_metadata
```
16. Validate transaction requries posting key
```
curl --data '{"method":"call","params":["database_api","get_potential_signatures",[{ "ref_block_num": 0,  "ref_block_prefix": 0, "expiration": "1970-01-01T00:00:00", "operations": [[ "account_metadata",{ "account": "profile", "json_metadata": "{\"name\":\"operation\"}" } ] ], "extensions": [] }]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
```
15. Get posting key for account
```
curl --data '{"method":"call","params":["database_api","get_accounts",[["profile"]]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool  | grep -A 5 -F '"posting"'
```
17. Sign transaction
```
sign_transaction { "ref_block_num": 0,  "ref_block_prefix": 0, "expiration": "1970-01-01T00:00:00", "operations": [[ "account_metadata",{ "account": "profile", "json_metadata": "{\"name\":\"transaction\"}" } ] ], "extensions": [] }
```
18. Validate json metadata has changed
```
curl --data '{"method":"call","params":["database_api","get_accounts",[["profile"]]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool  | grep json_metadata
```
