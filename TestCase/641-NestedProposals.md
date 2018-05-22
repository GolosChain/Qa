https://github.com/GolosChain/golos/issues/641

1. Run daemon
2. Run and prepare cli_wallet
```
set_password 1qaz
unlock 1qaz
import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS
```
3. Create users alice, bob, cat, dog
```
create_account cyberfounder alice "{}" "300.000 GOLOS" true
create_account cyberfounder bob "{}" "300.000 GOLOS" true
create_account cyberfounder cat "{}" "300.000 GOLOS" true
create_account cyberfounder dog "{}" "300.000 GOLOS" true
```
4. Create a builder (id = 0) for a main transaction with transfers
```
begin_builder_transaction
add_operation_to_builder_transaction 0 ["transfer", {"from":"bob", "to":"alice", "amount":"100.000 GOLOS", "memo":"from bob"}]
add_operation_to_builder_transaction 0 ["transfer", {"from":"cat", "to":"alice", "amount":"100.000 GOLOS", "memo":"from cat"}]
add_operation_to_builder_transaction 0 ["transfer", {"from":"dog", "to":"alice", "amount":"100.000 GOLOS", "memo":"from dog"}]
```
5. Create a builder (id = 1) with a child transaction with transfers
```
begin_builder_transaction
add_operation_to_builder_transaction 1 ["transfer", {"from":"alice", "to":"cat", "amount":"150.000 GOLOS", "memo":"prize"}]
add_operation_to_builder_transaction 1 ["transfer", {"from":"alice", "to":"dog", "amount":"150.000 GOLOS", "memo":"prize"}]
add_operation_to_builder_transaction 1 ["transfer", {"from":"cat", "to":"alice", "amount":"1.000 GOLOS", "memo":"reward"}]
add_operation_to_builder_transaction 1 ["transfer", {"from":"dog", "to":"alice", "amount":"1.000 GOLOS", "memo":"reward"}]
propose_builder_transaction 1 cat case "" "2018-05-11T14:00:00" "1970-01-01T00:00:00" false
```
6. Create a builder (id = 2) with a child transaction with transfers
```
begin_builder_transaction
add_operation_to_builder_transaction 2 ["transfer", {"from":"alice", "to":"dog", "amount":"150.000 GOLOS", "memo":"prize"}]
add_operation_to_builder_transaction 2 ["transfer", {"from":"alice", "to":"bob", "amount":"150.000 GOLOS", "memo":"prize"}]
add_operation_to_builder_transaction 2 ["transfer", {"from":"dog", "to":"alice", "amount":"1.000 GOLOS", "memo":"reward"}]
add_operation_to_builder_transaction 2 ["transfer", {"from":"bob", "to":"alice", "amount":"1.000 GOLOS", "memo":"reward"}]
propose_builder_transaction 2 dog case "" "2018-05-11T14:00:00" "1970-01-01T00:00:00" false
```
7. Create a builder (id = 3) with a child transaction with transfers
```
begin_builder_transaction
add_operation_to_builder_transaction 3 ["transfer", {"from":"alice", "to":"bob", "amount":"150.000 GOLOS", "memo":"prize"}]
add_operation_to_builder_transaction 3 ["transfer", {"from":"alice", "to":"cat", "amount":"150.000 GOLOS", "memo":"prize"}]
add_operation_to_builder_transaction 3 ["transfer", {"from":"bob", "to":"alice", "amount":"1.000 GOLOS", "memo":"reward"}]
add_operation_to_builder_transaction 3 ["transfer", {"from":"cat", "to":"alice", "amount":"1.000 GOLOS", "memo":"reward"}]
propose_builder_transaction 3 bob case "" "2018-05-11T14:00:00" "1970-01-01T00:00:00" false
```
8. Add copy of child-transactions (id = 1, 2, 3) into the main transaction (id = 0)
```
add_operation_copy_to_builder_transaction 1 0 0
add_operation_copy_to_builder_transaction 2 0 0
add_operation_copy_to_builder_transaction 3 0 0
```
9. Preview the transactions
```
preview_builder_transaction 0
preview_builder_transaction 1
preview_builder_transaction 2
preview_builder_transaction 3
```
10. Push the proposal transaction to the daemon
```
propose_builder_transaction 0 alice game "memo..." "2018-05-22T19:00:00" "1970-01-01T00:00:00" true
```
11. Request proposed transaction
```
curl --data '{"method":"call","params":["database_api","get_proposed_transactions",["alice",0,100]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_proposed_transactions",["bob",0,100]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_proposed_transactions",["cat",0,100]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_proposed_transactions",["dog",0,100]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
```
12. Approve transaction
```
approve_proposal alice game {"active_approvals_to_add":["alice"]} true
approve_proposal alice game {"active_approvals_to_add":["bob", "cat"]} true
approve_proposal alice game {"active_approvals_to_add":["dog"]} true
```
13. Request proposed transaction
```
curl --data '{"method":"call","params":["database_api","get_proposed_transactions",["alice",0,100]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_proposed_transactions",["bob",0,100]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_proposed_transactions",["cat",0,100]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_proposed_transactions",["dog",0,100]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
```
