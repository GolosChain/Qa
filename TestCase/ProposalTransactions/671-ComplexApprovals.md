https://github.com/GolosChain/golos/issues/671

Actors: `alice`, `bob`, `eve`. Each (but eve) should have at least 1 GOLOS.

0. Create accounts if needed
```
create_account cyberfounder alice "" "300.000 GOLOS" true
create_account cyberfounder bob "" "300.000 GOLOS" true
create_account cyberfounder eve "" "300.000 GOLOS" true
transfer cyberfounder alice "1.000 GOLOS" "" true
transfer cyberfounder bob "1.000 GOLOS" "" true
```

### 1. Approving with account having other's `account_auth`
1. Give eve rights on bob's active signing. *Note: `key_auths` contains bob's publick key*
```
begin_builder_transaction
add_operation_to_builder_transaction 0 ["account_update", {"account":"bob", "active":{"weight_threshold":1,"account_auths":[["eve",1]],"key_auths":[["GLS7XejaKhPyLM4VzRGgHEf1X8ePqPFAV9CWNejjkN5u1MTDkUqik",1]]} }]
sign_builder_transaction 0 true
```

2. Create proposal, requiring alice and bob active approvals
```
begin_builder_transaction
add_operation_to_builder_transaction 1 ["transfer", {"from":"alice", "to":"bob", "amount":"1.000 GOLOS", "memo":"to bob"}]
add_operation_to_builder_transaction 1 ["transfer", {"from":"bob", "to":"alice", "amount":"1.000 GOLOS", "memo":"to alice"}]
propose_builder_transaction 1 alice p671 "" "2018-06-04T15:50:00" "1970-01-01T00:00:00" true
get_proposed_transactions alice 1 10
```

3. Approve it with alice and eve approval (have bob's auth), check it apply
```
approve_proposal alice p671 {"active_approvals_to_add":["alice", "eve"]} true
get_proposed_transactions alice 1 10
```

### 2. Removing account_auth after approving proposal

4. Create proposal, requiring alice and bob active approvals
```
begin_builder_transaction
add_operation_to_builder_transaction 1 ["transfer", {"from":"alice", "to":"bob", "amount":"1.000 GOLOS", "memo":"to bob"}]
add_operation_to_builder_transaction 1 ["transfer", {"from":"bob", "to":"alice", "amount":"1.000 GOLOS", "memo":"to alice"}]
propose_builder_transaction 1 alice p671-2 "" "2018-06-04T15:50:00" "1970-01-01T00:00:00" true
get_proposed_transactions alice 1 10
```

5. Approve it with eve's approval (have bob's auth)
```
approve_proposal alice p671-2 {"active_approvals_to_add":["eve"]} true
get_proposed_transactions alice 1 10
```

6. Remove bob's active auth from eve
```
begin_builder_transaction
add_operation_to_builder_transaction 2 ["account_update", {"account":"bob", "active":{"weight_threshold":1,"account_auths":[],"key_auths":[["GLS7XejaKhPyLM4VzRGgHEf1X8ePqPFAV9CWNejjkN5u1MTDkUqik",1]]} }]
sign_builder_transaction 2 true
```

7. Add alice and bob approvals to apply proposal
```
approve_proposal alice p671-2 {"active_approvals_to_add":["alice"]} true
get_proposed_transactions alice 1 10
approve_proposal alice p671-2 {"active_approvals_to_add":["bob"]} true
get_proposed_transactions alice 1 10
```
