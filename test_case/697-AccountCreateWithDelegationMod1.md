https://github.com/GolosChain/golos/issues/657

1. Set non-zero fee
```
update_witness cyberfounder "http://url" GLSXXXX {} true
update_chain_properties cyberfounder {"account_creation_fee":"1.000 GOLOS"} true
```

2. Wait 1 minute and check fee applied (api: `get_chain_properties`)

3. Check that create account with 0.999 GOLOS fails ("Insufficient Fee: 1.000 GOLOS required, 0.999 GOLOS provided")
```
create_account cyberfounder a697 "{}" "0.999 GOLOS" true
```

4. Check success if create account with 1.000 GOLOS
```
create_account cyberfounder a697 "{}" "1.000 GOLOS" true
```
