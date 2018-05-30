0. Prepare
```
transfer cyberfounder bob "101.000 GOLOS" "" true
```

### 1. Simple multilevel proposal
1. Create 16-level deep proposal
```
begin_builder_transaction
add_operation_to_builder_transaction 0 ["transfer", {"from":"bob", "to":"alice", "amount":"1.000 GOLOS", "memo":""}]
propose_builder_transaction 0 bob level1 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level2 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level3 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level4 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level5 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level6 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level7 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level8 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level9 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level10 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level11 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level12 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level13 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level14 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level15 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
propose_builder_transaction 0 bob level16 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" true
```
2. Check that it exists
```
get_proposed_transactions bob 0 10
```

3. Approve it and check that it applied
```
approve_proposal bob level16 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level15 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level14 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level13 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level12 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level11 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level10 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level9 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level8 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level7 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level6 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level5 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level4 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level3 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level2 {"active_approvals_to_add":["bob"]} true
approve_proposal bob level1 {"active_approvals_to_add":["bob"]} true
get_proposed_transactions bob 0 10
```

### 2. Self-executing multilevel proposal
1. Remove previous builder so new one will have id=0
```
remove_builder_transaction 0
```

2. Create and push proposal
```
begin_builder_transaction
add_operation_to_builder_transaction 0 ["transfer", {"from":"bob", "to":"alice", "amount":"1.000 GOLOS", "memo":""}]
propose_builder_transaction 0 bob level1 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level1","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level2 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level2","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level3 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level3","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level4 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level4","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level5 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level5","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level6 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level6","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level7 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level7","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level8 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level8","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level9 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level9","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level10 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level10","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level11 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level11","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level12 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level12","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level13 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level13","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level14 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level14","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level15 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" false
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob","title":"level15","active_approvals_to_add":["bob"]}]
propose_builder_transaction 0 bob level16 "" "2018-05-30T15:00:00" "1970-01-01T00:00:00" true
```

3. Check that it exists
```
get_proposed_transactions bob 0 10
```

4. Approve it. Check that it applied
```
approve_proposal bob level16 {"active_approvals_to_add":["bob"]} true
get_proposed_transactions bob 0 10
```

