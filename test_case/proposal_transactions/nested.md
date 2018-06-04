https://github.com/GolosChain/golos/issues/542,
https://github.com/GolosChain/golos/issues/641

Actors are 4 accounts, having following GOLOS balances:

alice|bob|cat|dog
-|-|-|-
0.000 | 101.000 | 102.000 | 103.000

0. Prepare accounts on fresh node
```
create_account cyberfounder alice "" true
create_account cyberfounder bob "" true
create_account cyberfounder cat "" true
create_account cyberfounder dog "" true
transfer cyberfounder bob "101.000 GOLOS" "" true
transfer cyberfounder cat "102.000 GOLOS" "" true
transfer cyberfounder dog "103.000 GOLOS" "" true
transfer_to_vesting cyberfounder alice "1.000 GOLOS" true
transfer_to_vesting cyberfounder bob "1.000 GOLOS" true
transfer_to_vesting cyberfounder cat "1.000 GOLOS" true
transfer_to_vesting cyberfounder dog "1.000 GOLOS" true
```

1. Start creation of parent transaction
```
begin_builder_transaction
add_operation_to_builder_transaction 0 ["transfer", {"from":"bob", "to":"alice", "amount":"100.000 GOLOS", "memo":"from bob"}]
add_operation_to_builder_transaction 0 ["transfer", {"from":"cat", "to":"alice", "amount":"100.000 GOLOS", "memo":"from cat"}]
add_operation_to_builder_transaction 0 ["transfer", {"from":"dog", "to":"alice", "amount":"100.000 GOLOS", "memo":"from dog"}]
```

2. Create nested proposals
```
begin_builder_transaction
add_operation_to_builder_transaction 1 ["transfer", {"from":"alice", "to":"cat", "amount":"150.000 GOLOS", "memo":"prize"}]
add_operation_to_builder_transaction 1 ["transfer", {"from":"alice", "to":"dog", "amount":"150.000 GOLOS", "memo":"prize"}]
add_operation_to_builder_transaction 1 ["transfer", {"from":"cat", "to":"alice", "amount":"1.000 GOLOS", "memo":"reward"}]
add_operation_to_builder_transaction 1 ["transfer", {"from":"dog", "to":"alice", "amount":"1.000 GOLOS", "memo":"reward"}]
propose_builder_transaction 1 bob case1 "" "2018-05-16T14:00:00" "1970-01-01T00:00:00" false

begin_builder_transaction
add_operation_to_builder_transaction 2 ["transfer", {"from":"alice", "to":"bob", "amount":"150.000 GOLOS", "memo":"prize"}]
add_operation_to_builder_transaction 2 ["transfer", {"from":"alice", "to":"dog", "amount":"150.000 GOLOS", "memo":"prize"}]
add_operation_to_builder_transaction 2 ["transfer", {"from":"bob", "to":"alice", "amount":"1.000 GOLOS", "memo":"reward"}]
add_operation_to_builder_transaction 2 ["transfer", {"from":"dog", "to":"alice", "amount":"1.000 GOLOS", "memo":"reward"}]
propose_builder_transaction 2 cat case2 "" "2018-05-16T14:00:00" "1970-01-01T00:00:00" false

begin_builder_transaction
add_operation_to_builder_transaction 3 ["transfer", {"from":"alice", "to":"cat", "amount":"150.000 GOLOS", "memo":"prize"}]
add_operation_to_builder_transaction 3 ["transfer", {"from":"alice", "to":"bob", "amount":"150.000 GOLOS", "memo":"prize"}]
add_operation_to_builder_transaction 3 ["transfer", {"from":"cat", "to":"alice", "amount":"1.000 GOLOS", "memo":"reward"}]
add_operation_to_builder_transaction 3 ["transfer", {"from":"bob", "to":"alice", "amount":"1.000 GOLOS", "memo":"reward"}]
propose_builder_transaction 3 dog case3 "" "2018-05-16T14:00:00" "1970-01-01T00:00:00" false
```
*Note: expiration time in each nested proposal should be changed to be actual.*

3. Copy nested proposals into parent and add `alice` approvals to each
```
add_operation_copy_to_builder_transaction 1 0 0
add_operation_copy_to_builder_transaction 2 0 0
add_operation_copy_to_builder_transaction 3 0 0

add_operation_to_builder_transaction 0 ["proposal_update", {"author":"bob", "title":"case1", "active_approvals_to_add":["alice"]}]
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"cat", "title":"case2", "active_approvals_to_add":["alice"]}]
add_operation_to_builder_transaction 0 ["proposal_update", {"author":"dog", "title":"case3", "active_approvals_to_add":["alice"]}]
```

4. Proposal is ready to broadcast, check, is it correct
    * `preview_builder_transaction 0`

5. Propose operations and broadcast proposal
    * `propose_builder_transaction 0 alice game "some memo" "2018-05-16T15:00:00" "1970-01-01T00:00:00" true`
    * *Note: expiration time should be changed to be actual.*

6. Check if proposal exist, have no active approvals and have required approvals of 4 accounts.
    * `get_proposed_transactions alice 0 10`

7. Add approvals
```
approve_proposal alice game {"active_approvals_to_add":["alice"]} true
approve_proposal alice game {"active_approvals_to_add":["bob"]} true
approve_proposal alice game {"active_approvals_to_add":["cat"]} true
approve_proposal alice game {"active_approvals_to_add":["dog"]} true
```

8. Check that initial proposal is no more exist and we have 3 new proposals, check they approvals.
Also check that `alice`, `bob`, `cat` and `dog` balances updated.
    * `get_proposed_transactions alice 0 10`
    * `get_accounts ["alice","bob","cat","dog"]`

9. Let `bob` approve `case3`, `cat` approve `case1` and `dog` push transaction, approving `case1` and `case2` and deleting `case3`
```
approve_proposal dog case3 {"active_approvals_to_add":["bob"]} true
approve_proposal bob case1 {"active_approvals_to_add":["cat"]} true
begin_builder_transaction
add_operation_to_builder_transaction 4 ["proposal_delete", {"author":"dog","title":"case3","requester":"dog"}]
add_operation_to_builder_transaction 4 ["proposal_update", {"author":"bob","title":"case1","active_approvals_to_add":["dog"]}]
add_operation_to_builder_transaction 4 ["proposal_update", {"author":"cat","title":"case2","active_approvals_to_add":["dog"]}]
sign_builder_transaction 4 true
```

10. Check that `case1` proposal applied and no more exist. Check that `case3` proposal mo nore exist.
Check that `alice`, `cat` and `dog` balances updated
    * `get_proposed_transactions bob 0 10`
    * `get_accounts ["alice","bob","cat","dog"]`

11. Add `bob` approval on `case2` proposal
    * `approve_proposal cat case2 {"active_approvals_to_add":["bob"]} true`

12. Check that `case2` proposal don't applied and still exist. Check that `alice`, `bob`, `cat` and `dog` balances didn't changed.
    * `get_proposed_transactions bob 0 10`
    * `get_accounts ["alice","bob","cat","dog"]`

13. Fund alice with 300 GOLOS
    * `transfer cyberfounder alice "300.000 GOLOS" "to apply at expire" true`

14. Wait until `case2` expire and check that it applied and no more exist.
Check that `alice`, `bob` and `cat` balances updated
    * `get_proposed_transactions cat 0 10`
    * `get_accounts ["alice","bob","cat","dog"]`

