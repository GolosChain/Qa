https://github.com/GolosChain/golos/issues/636

1. Run daemon
2. Wait HF18
3. Run and prepare `cli_wallet`
```
set_password 1qaz
unlock 1qaz
import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS
```
4. Create accounts
```
create_account cyberfounder alice "" "1.000 GOLOS" true
create_account cyberfounder bob "" "1.000 GOLOS" true
create_account cyberfounder cat "" "1.000 GOLOS" true
transfer cyberfounder bob "101.000 GOLOS" "" true
```
5. Create a transaction builder
```
begin_builder_transaction
add_operation_to_builder_transaction 0 ["account_metadata_operation", {"account":"alice", "json_metadata":"{\"name\":\"alice\"}"}]
add_operation_to_builder_transaction 0 ["transfer", {"from":"bob", "to":"cat", "amount":"100.000 GOLOS", "memo":"part two"}]
```
6. Preview transaction
```
preview_builder_transaction 0
```
7. Create transaction proposal
```
propose_builder_transaction 0 alice test "memo" "2018-05-22T22:15:00" "1970-01-01T00:00:00" true
```
8. Check preview shows the same result as in step 5
```
preview_builder_transaction 0
```
