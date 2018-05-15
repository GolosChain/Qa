


1. prepare accounts and fund them. (if accounts already exist, they GOLOS balances should be set: jim=100, joe=0)
    * `create_account cyberfounder jim "" true`
    * `create_account cyberfounder joe "" true`
    * `create_account cyberfounder cat "" true`
    * `transfer_to_vesting cyberfounder jim "1.000 GOLOS" true`
    * `transfer_to_vesting cyberfounder joe "1.000 GOLOS" true`
    * `transfer cyberfounder jim "100.000 GOLOS" "" true`
2. create proposal funding cat account if both alice and bob agree
    * `begin_builder_transaction`
    * `add_operation_to_builder_transaction 4 ["transfer", {"from":"jim", "to":"cat", "amount":"10.000 GOLOS", "memo":"part1"}]`
    * `add_operation_to_builder_transaction 4 ["transfer", {"from":"joe", "to":"cat", "amount":"10.000 GOLOS", "memo":"part2"}]`
    * `propose_builder_transaction 4 jim fund "" "2018-05-15T19:50:00" "1970-01-01T00:00:00" true`
3. approve proposal so it can apply
    * `approve_proposal jim fund {"active_approvals_to_add":["jim"]} true`
    * `approve_proposal jim fund {"active_approvals_to_add":["joe"]} true`
4. proposal approved, but didn't applied because joe balance is not enough. check no transfers made
    * `get_account_history jim -1 100`
      * should have `proposal_update` as last operation
      * ...
