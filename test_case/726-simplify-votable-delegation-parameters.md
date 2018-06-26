# Simplify votable delegation parameters #
## Description ##
We had multipliers to calculate delegation parameters:

- `account_creation_fee`
- `create_account_with_golos_modifier`
- `create_account_delegation_ratio`
- `min_delegation_multiplier`

This makes system flexible, but somewhat hard to understand.

To simplify, we've changed this to absolute values:

- `account_creation_fee`
- `create_account_min_golos_fee`
- `create_account_min_delegation`
- `min_delegation`

All this values can be set in GOLOS.


param|description
-|-
`account_creation_fee` | Now it's used only in `create_account operation` (as in previous HF)
`create_account_min_golos_fee` | When use `account_create_with_delegation` it's minimal fee (in GOLOS) creator should pay (+ he delegates `create_account_min_delegation` amount)
`create_account_min_delegation` | When use `account_create_with_delegation` it's GP minimal delegation amount creator delegate to new account (can be reduced if `fee` > `create_account_min_golos_fee`)
`min_delegation` | When anybody delegates, it's minimal delegated GP can be sent to delegatee

# Test cases #

Before all test cases you should sure that you have some valid parameters. If they are not. Just some small values. For instance:
```
update_chain_properties "cyberfounder" {"account_creation_fee":"1.000 GOLOS", "create_account_min_golos_fee":"0.001 GOLOS", "create_account_min_delegation":"5.000 GOLOS", "min_delegation":"5.000 GOLOS"} true
```


- Tests for create_account_delegated and params `create_account_min_delegation` and `create_account_min_golos_fee`
    1. Lets set some "big" values for parapeters, for better understanding

        ```
        update_chain_properties "cyberfounder" {"account_creation_fee":"5.000 GOLOS", "create_account_min_golos_fee":"2.000 GOLOS", "create_account_min_delegation":"10.000 GOLOS", "min_delegation":"5.000 GOLOS"} true
        ```

    2. Try to use `create_account_delegated` with minimal fee and delegated GP

        ```
        create_account_delegated cyberfounder "0.001 GOLOS" "0.000001 GESTS" trinity "{}" true
        ```

        Excepted result:
        ```
        Assert Exception (10)
        current_delegation >= target_delegation: Inssufficient Delegation 12522.423076 GESTS required, 2.087071 GESTS provided.
        ```

    3. Try to set enough GESTS for delegation
        ```
        create_account_delegated cyberfounder "0.001 GOLOS" "12522.423076 GESTS" trinity "{}" true
        ``` 

        Excepted result:
        ```
        Assert Exception (10)
        o.fee >= median_props.create_account_min_golos_fee: Insufficient Fee: 2.000 GOLOS required, 0.001 GOLOS provided.
        ```

    4. Set enough fee.
        ```
        create_account_delegated cyberfounder "2.000 GOLOS" "12522.423076 GESTS" trinity "{}" true
        ```

        Everything should be fine.


- Tests for `min_delegation`
    1.

    ```
    create_account_delegated cyberfounder "3.000 GOLOS" "0.100000 GESTS" jim "{}" true
    ```

- Tests for `min_delegation`
    1. Set the `min_delegation` to 5 GOLOS.

        ```
        update_chain_properties "cyberfounder" {"min_delegation": "5.000 GOLOS"} true
        ``` 

    2. Create needed accounts for tests.
    
        ```
        create_account cyberfounder morpheus "{}" "1.000 GOLOS" true
        ```

    3. Try to delegate amount GP less than `min_delegation`. Some very little amount of GP.
    
        ```
        delegate_vesting_shares cyberfounder morpheus "1.000000 GESTS" true
        ```
    
        First of all you can have problems with this assert:
        ```
        FC_ASSERT((increasing ? delta : -delta) >= min_update,
        "Delegation difference is not enough. min_update: ${min}", ("min", min_update));
        ```
        where `min_update = create_account_min_golos_fee * v_share_price`. It is also needed to don't pass very small delegations.

    4. Next try to delegate more than `min_update` from previous point.
        ```
        delegate_vesting_shares cyberfounder morpheus "2.000000 GESTS" true
        ```
        Excepted result:
        ```
        {"error":"Assert Exception (10)
        op.vesting_shares >= min_delegation: Account must delegate a minimum of 13451.318652 GESTS
        ```

    5. Then try to delegate exactly 13451.318652 GESTS.
        ```
        delegate_vesting_shares cyberfounder morpheus "13451.318652 GESTS" true
        ```
    
        Getting OK. min_delegation works.

-  `create_account_min_delegation`
    1. First lets set some initial value for votable paratmeters
    
        ```
        update_chain_properties "cyberfounder" {"account_creation_fee":"1.000 GOLOS", "create_account_min_golos_fee":"1.000 GOLOS", "create_account_min_delegation":"10.000 GOLOS", "min_delegation":"10.000 GOLOS"} true
        ```

    2. Then try to create account with too small fee and delegated GP.
    
        ```
        create_account_delegated cyberfounder "0.100 GOLOS" "10000.000000 GESTS" neo "{}" true
        ```

        Excepted result:
        ```
        error: assertion current_delegation >= target_delegation: Inssufficient Delegation 21052.884542 GESTS required, 12105.288454 GESTS provided...
        ```

    3. Try to create account with too small fee only.
    
        ```
        create_account_delegated cyberfounder "0.100 GOLOS" "23000.000000 GESTS" neo "{}" true
        ```
    
        Excepted result:
        ```
        error: assertion fee >= median_props.create_account_min_golos_fee: Insufficient Fee: 1.000 GOLOS required, 0.100 GOLOS provided.
        ```

    4. Try to create account with enough fee and delegated GP.
        ```
        create_account_delegated cyberfounder "1.000 GOLOS" "23000.000000 GESTS" neo "{}" true
        ```

        Now everything have to be ok.
