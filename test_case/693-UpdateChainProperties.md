https://github.com/GolosChain/golos/issues/693

0. Wait HF•18, and check current chain properties (`info`)

1. Check that `update_witness` command works
```
update_witness cyberfounder localhost GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee":"2.500 GOLOS"} true
```

2. Check that `witness_update` operation works with empty props
```
begin_builder_transaction
add_operation_to_builder_transaction 0 ["witness_update",{"owner": "cyberfounder", "url": "localhost", "block_signing_key": "GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6", "props": {}, "fee": "0.000 GOLOS"}]
sign_builder_transaction 0 true
```

3. Check that `witness_update` operation works with default props
```
remove_builder_transaction 0
begin_builder_transaction
add_operation_to_builder_transaction 0 ["witness_update",{"owner": "cyberfounder", "url": "localhost", "block_signing_key": "GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6", "props": {"account_creation_fee": "0.000 GOLOS", "maximum_block_size": 131072, "sbd_interest_rate": 1000}, "fee": "0.000 GOLOS"}]
sign_builder_transaction 0 true
```

4. Check that `witness_update` don't change props values and prints warnings to golosd console if properties have not default values
    * `account_creation_fee`
    ```
    remove_builder_transaction 0
    begin_builder_transaction
    add_operation_to_builder_transaction 0 ["witness_update",{"owner": "cyberfounder", "url": "localhost", "block_signing_key": "GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6", "props": {"account_creation_fee": "5.000 GOLOS"}, "fee": "0.000 GOLOS"}]
    sign_builder_transaction 0 true
    ```

    * `maximum_block_size`
    ```
    remove_builder_transaction 0
    begin_builder_transaction
    add_operation_to_builder_transaction 0 ["witness_update",{"owner": "cyberfounder", "url": "localhost", "block_signing_key": "GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6", "props": {"maximum_block_size": 65536}, "fee": "0.000 GOLOS"}]
    sign_builder_transaction 0 true
    ```

    * `sbd_interest_rate`
    ```
    remove_builder_transaction 0
    begin_builder_transaction
    add_operation_to_builder_transaction 0 ["witness_update",{"owner": "cyberfounder", "url": "localhost", "block_signing_key": "GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6", "props": {"sbd_interest_rate": 2000}, "fee": "0.000 GOLOS"}]
    sign_builder_transaction 0 true
    ```

    * all 3
    ```
    remove_builder_transaction 0
    begin_builder_transaction
    add_operation_to_builder_transaction 0 ["witness_update",{"owner": "cyberfounder", "url": "localhost", "block_signing_key": "GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6", "props": {"account_creation_fee": "5.000 GOLOS", "maximum_block_size": 65536, "sbd_interest_rate": 2000}, "fee": "0.000 GOLOS"}]
    sign_builder_transaction 0 true
    ```

5. Wait at least 1 minute and check that properties didn't changed
```
info
```

6. Check that `update_chain_properties` updates values
```
update_chain_properties cyberfounder {"account_creation_fee":"1.500 GOLOS", "maximum_block_size":65536, "sbd_interest_rate":999, "create_account_with_golos_modifier":25, "create_account_delegation_ratio":3, "create_account_delegation_time":"80001000000", "min_delegation_multiplier":9} true
```

7. Wait 1 minute and check that all properties actually set
```
info
```
