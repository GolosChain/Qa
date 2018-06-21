# Witness update method enhancement #
In 18.0 RC1 there was a problem with method `witness_update` in cli_wallet. When you tried to call this API mehtod with `witness_api` plugin disabled then you got an exception, saying that you have to enable the plugin. But actually `witness_api` is needed only to get method `get_witness_by_account`. We've improved the logic and now it's needed only in case if `url == ""`.

# Test case #

1. Build 18.0 RC1. Then run `golosd`. Remove `witness_api` from plugins in `config.ini` and execute cli_wallet command `witness_update`. 
	1. The test case shouldn't return OK result, because `witness_api` is needed.
	```
		update_witness cyberfounder localhost GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "1.001 GOLOS", "create_account_with_golos_modifier":25, "create_account_delegation_ratio":3, "create_account_delegation_time":80001000000, "min_delegation_multiplier":9} true
	```

	2. With empty url. The test case shouldn't return OK result, because `witness_api` is needed too.
		```
		update_witness cyberfounder "" GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "1.001 GOLOS", "create_account_with_golos_modifier":25, "create_account_delegation_ratio":3, "create_account_delegation_time":80001000000, "min_delegation_multiplier":9} true
		```

2. Build latest version of 18 HF. Then run `golosd`. Remove `witness_api` from plugins in `config.ini` and execute cli_wallet command `witness_update`. 
	1. The test case should return OK result, because `witness_api` is needed.
	```
		update_witness cyberfounder localhost GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "1.001 GOLOS", "create_account_with_golos_modifier":25, "create_account_delegation_ratio":3, "create_account_delegation_time":80001000000, "min_delegation_multiplier":9} true
	```

	2. With empty url. The test case shouldn't return OK result, because `witness_api` is needed.
		```
		update_witness cyberfounder "" GLS58g5rWYS3XFTuGDSxLVwiBiPLoAyCZgn6aB9Ueh8Hj5qwQA3r6 {"account_creation_fee": "1.001 GOLOS", "create_account_with_golos_modifier":25, "create_account_delegation_ratio":3, "create_account_delegation_time":80001000000, "min_delegation_multiplier":9} true
		```
