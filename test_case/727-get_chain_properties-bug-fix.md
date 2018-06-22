# Bug description #
During work on 18.0 HF method `get_chain_properties` has "lost" field `sbd_interest_rate`. 
Bug fix was return reflect of field `sbd_interest_rate`

# Test case #

```
curl --data '{"method":"call","params":["database_api","get_chain_properties",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | json_reformat 
```

Result:

```
{
    "jsonrpc": "2.0",
    "result": {
        "account_creation_fee": "500.000 GOLOS",
        "maximum_block_size": 131072,
        "sbd_interest_rate": 1000,
        "create_account_min_golos_fee": "1.000 GOLOS",
        "create_account_min_delegation": "1.000 GOLOS",
        "create_account_delegation_time": 86400,
        "min_delegation": "42.000 GOLOS"
    },
    "id": 0
}
```

