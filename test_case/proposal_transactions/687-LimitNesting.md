https://github.com/GolosChain/golos/issues/687

0. Prepare
```
transfer cyberfounder bob "10.000 GOLOS" "" true
```

### 1. Simple multilevel proposal
1. Check that creating 3-level depth proposal fails
```
begin_builder_transaction
add_operation_to_builder_transaction 0 ["transfer", {"from":"bob", "to":"alice", "amount":"1.000 GOLOS", "memo":""}]
propose_builder_transaction 0 bob level1 "" "2018-06-05T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level2 "" "2018-06-05T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level3 "" "2018-06-05T15:00:00" "1970-01-01T00:00:00" true
```

2. Create 2-level depth proposal
```
remove_builder_transaction 0
begin_builder_transaction
add_operation_to_builder_transaction 0 ["transfer", {"from":"bob", "to":"alice", "amount":"1.000 GOLOS", "memo":""}]
propose_builder_transaction 0 bob level1 "" "2018-06-05T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level2 "" "2018-06-05T15:00:00" "1970-01-01T00:00:00" true
```

3. Check that it exists
```
get_proposed_transactions bob 0 10
```

3. Approve it and check that it applied
```
approve_proposal bob level2 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level1 {"active_approvals_to_add":["bob"]} true
get_proposed_transactions bob 0 10
```

### 2. Self-executing multilevel proposal

4. Create and push proposal
```
remove_builder_transaction 0
begin_builder_transaction
add_operation_to_builder_transaction 0 ["transfer", {"from":"bob", "to":"alice", "amount":"1.000 GOLOS", "memo":""}]
propose_builder_transaction 0 bob level1 "" "2018-06-05T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level1","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level2 "" "2018-06-05T15:00:00" "1970-01-01T00:00:00" true
```

5. Check that it exists
```
get_proposed_transactions bob 0 10
```

6. Approve it. Check that it applied
```
approve_proposal bob level2 {"active_approvals_to_add":["bob"]} true
get_proposed_transactions bob 0 10
```
