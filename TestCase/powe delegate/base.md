#Delegation of voting power
##Direct Delegation

###Basic:
1.  Create user account 1
2.  Сheck for existence of user account 1
3.  Create user account 2
4.  Check for existence of user account 2
5.  User 1 sends to user 2 some voice power
6.  Check for the volume of the voice power belonging user 1, field delegated_vesting_shares
7.  Check for the volume of the voice power belonging user 2 field received_vesing_shares
8.  Check get_delegations
9.  User 1 requires the VP back 
10. Check get_expiring_delegations
11. Check that the voice power were returned to the user 1 at the end of delegation  period
12. Check that the voice power were withdrawn from the user account 2
13. Check that  the curation rewards are received by the user account 2 even after  the end of delegation  period
