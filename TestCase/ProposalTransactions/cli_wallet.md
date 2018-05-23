https://github.com/GolosChain/golos/issues/633

0. Actors are `alice` and `bob`; `alice` and `bob` should have some GOLOS balance

1. Start transaction builder (id=0), add 2 operations to it and preview result (both operations should exist)
    ```
    begin_builder_transaction
    add_operation_to_builder_transaction 0 ["transfer", {"from":"alice", "to":"bob", "amount":"10.000 GOLOS", "memo":"to bob"}]
    add_operation_to_builder_transaction 0 ["transfer", {"from":"bobr", "to":"alice", "amount":"10.000 GOLOS", "memo":"from bob"}]
    preview_builder_transaction 0
    ```

2. Replace second operation with new one (fix transfer's "from") and check it changed
    ```
    replace_operation_in_builder_transaction 0 1 ["transfer", {"from":"bob", "to":"alice", "amount":"10.000 GOLOS", "memo":"from bob"}]
    preview_builder_transaction 0
    ```

3. Sign transaction, check it printed with signatures (don't push)
    ```
    sign_builder_transaction 0 false
    ```

4. Start new transaction builder, check it's id=1
    ```
    begin_builder_transaction
    ```
5. Remove both transaction builders, check preview shows error and start new one, check it's id=0
    ```
    remove_builder_transaction 0
    remove_builder_transaction 1
    preview_builder_transaction 0
    preview_builder_transaction 1
    begin_builder_transaction
    ```

6. Add operation and propose transaction (don't push), check that operations of transaction became `proposed_operations` inside `proposal_create` operation
    ```
    add_operation_to_builder_transaction 0 ["transfer", {"from":"alice", "to":"bob", "amount":"1.000 GOLOS", "memo":"to bob"}]
    add_operation_to_builder_transaction 0 ["transfer", {"from":"bob", "to":"alice", "amount":"1.000 GOLOS", "memo":"to alice"}]
    propose_builder_transaction 0 alice test633 "" "2018-05-23T15:50:00" "1970-01-01T00:00:00" false
    preview_builder_transaction 0
    ```

7. Add one more operation, sign and push tansaction
    ```
    add_operation_to_builder_transaction 0 ["transfer", {"from":"alice", "to":"bob", "amount":"1.000 GOLOS", "memo":"to bob3"}]
    sign_builder_transaction 0 true
    ```

8. Fetch proposals created by `alice`, check `test633` proposal exists and , contains 2 `transfer` ops
    ```
    get_proposed_transactions alice 0 10
    ```

9. Try remove non existing approvals, check all 4 commands fail
    ```
    approve_proposal alice test633 {"owner_approvals_to_remove":["alice"]} true
    approve_proposal alice test633 {"active_approvals_to_remove":["alice"]} true
    approve_proposal alice test633 {"posting_approvals_to_remove":["alice"]} true
    approve_proposal alice test633 {"key_approvals_to_remove":["GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6"]} true
    ```

10. Approve proposal with not required approvals, check it still exist
    ```
    approve_proposal alice test633 {"active_approvals_to_add":["cyberfounder"], "key_approvals_to_add":["GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6"]} true
    get_proposed_transactions alice 0 10
    ```

11. Remove approvals from previous step and add `alice` and `bob` approvals, check proposal applied and no more exist (result=[])
    ```
    approve_proposal alice test633 {"active_approvals_to_add":["alice", "bob"], "active_approvals_to_remove":["cyberfounder"], "key_approvals_to_remove":["GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6"]} true
    get_proposed_transactions alice 0 10
    ```
