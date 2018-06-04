https://github.com/GolosChain/golos/issues/671

Actors: `alice`, `bob`. Each should have at least 1 GOLOS.

1. Create proposal
```
begin_builder_transaction
add_operation_to_builder_transaction 0 ["transfer", {"from":"alice", "to":"bob", "amount":"1.000 GOLOS", "memo":"to bob"}]
add_operation_to_builder_transaction 0 ["transfer", {"from":"bob", "to":"alice", "amount":"1.000 GOLOS", "memo":"to alice"}]
propose_builder_transaction 0 alice test671 "" "2018-05-23T15:50:00" "1970-01-01T00:00:00" true
get_proposed_transactions alice 0 10
```

2. Try approve it with required and foreign key. Each command should fail.
```
approve_proposal alice test671 {"active_approvals_to_add":["alice", "cyberfounder"], "key_approvals_to_add":["GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6"]} true
approve_proposal alice test671 {"active_approvals_to_add":["alice"], "key_approvals_to_add":["GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6"]} true
approve_proposal alice test671 {"key_approvals_to_add":["GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6"]} true
approve_proposal alice test671 {"active_approvals_to_add":["alice", "cyberfounder"]} true
approve_proposal alice test671 {"active_approvals_to_add":["cyberfounder"]} true
approve_proposal alice test671 {"active_approvals_to_add":["alice", "bob", "cyberfounder"]} true
```

3. Approve it witn required accounts and check that proposal applied
```
approve_proposal alice test671 {"active_approvals_to_add":["alice", "bob"]} true
```
