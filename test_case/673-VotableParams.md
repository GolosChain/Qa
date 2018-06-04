https://github.com/GolosChain/golos/issues/673

### 1. Check that chain parameters changed

1. Check current chain parameters with `info` command of `cli_wallet`
2. Call `update_witness` from `cli_wallet` to update parameters
```
update_witness cyberfounder localhost GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "1.001 GOLOS", "create_account_with_golos_modifier":25, "create_account_delegation_ratio":3, "create_account_delegation_time":80001000000, "min_delegation_multiplier":9} true
```
3. Wait 1 minute and check that `info` returns new values

4. Add `chain_properties_update` operation directly
```
begin_builder_transaction
add_operation_to_builder_transaction 0 ["chain_properties_update", {"owner":"cyberfounder", "props":[1,{"account_creation_fee":"1.002 GOLOS","maximum_block_size":131000,"sbd_interest_rate":1001,"create_account_with_golos_modifier":24,"create_account_delegation_ratio":2,"create_account_delegation_time":"80001000001","min_delegation_multiplier":8}]}]
sign_builder_transaction 0 true
```

5. Wait 1 minute and check that `info` returns new values

### 2. Check limits

6. Check that each of the following commands fails
```
update_witness cyberfounder localhost GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "1.001 GOLOS", "create_account_with_golos_modifier":0, "create_account_delegation_ratio":3, "create_account_delegation_time":80001000000, "min_delegation_multiplier":9} true
update_witness cyberfounder localhost GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "1.001 GOLOS", "create_account_with_golos_modifier":25, "create_account_delegation_ratio":0, "create_account_delegation_time":80001000000, "min_delegation_multiplier":9} true
update_witness cyberfounder localhost GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "1.001 GOLOS", "create_account_with_golos_modifier":25, "create_account_delegation_ratio":3, "create_account_delegation_time":42299999999, "min_delegation_multiplier":9} true
update_witness cyberfounder localhost GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "1.001 GOLOS", "create_account_with_golos_modifier":25, "create_account_delegation_ratio":3, "create_account_delegation_time":80001000000, "min_delegation_multiplier":0} true
```

### 3. Check that median calculated correctly

7. Create 2 more witness accounts
```
create_account cyberfounder wi1 "" "200.000 GOLOS" true
create_account cyberfounder wi2 "" "200.000 GOLOS" true
```

8. Update witness parameters
```
update_witness cyberfounder localhost GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "1.005 GOLOS", "create_account_with_golos_modifier":27, "create_account_delegation_ratio":8, "create_account_delegation_time":80001000000, "min_delegation_multiplier":9} true
update_witness wi1 no GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "1.006 GOLOS", "create_account_with_golos_modifier":20, "create_account_delegation_ratio":1, "create_account_delegation_time":60001000000, "min_delegation_multiplier":9} true
update_witness wi2 no GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "1.007 GOLOS", "create_account_with_golos_modifier":45, "create_account_delegation_ratio":7, "create_account_delegation_time":50001000000, "min_delegation_multiplier":20} true
```

9. Wait 1 minute and check that median parameters set
```
info
```

parameter|expected value
-|-
account_creation_fee | 1.006 GOLOS
create_account_with_golos_modifier | 27
create_account_delegation_ratio | 7
create_account_delegation_time | 60001000000
min_delegation_multiplier | 9

***

**Note:** setting 3 same signing keys will break testnet in several minutes.
