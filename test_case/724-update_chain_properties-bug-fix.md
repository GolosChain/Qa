# Bug description #
Cli_wallet update_chain_properties had bug: 
If not all fields are filled, for example in case when you don't need to change all of them, then you will be surprised, that all other fields would be set by default values.


# Test case #

1. First lets get information about current chain parameters

	```
	info
	```

	Result:
	```
	{
	  "id": 0,
	  "head_block_number": 129,
	  "head_block_id": "00000081b34f8c93aa5784c6416c16e9f18ee179",
	  "time": "2018-06-22T11:21:21",
	  "current_witness": "cyberfounder",
	  "total_pow": 10,
	  "num_pow_witnesses": 1,
	  "virtual_supply": "43306298.516 GOLOS",
	  "current_supply": "43306298.516 GOLOS",
	  "confidential_supply": "0.000 GOLOS",
	  "current_sbd_supply": "0.000 GBG",
	  "confidential_sbd_supply": "0.000 GBG",
	  "total_vesting_fund_steem": "39.840 GOLOS",
	  "total_vesting_shares": "201700.222184 GESTS",
	  "total_reward_fund_steem": "50.676 GOLOS",
	  "total_reward_shares2": "0",
	  "sbd_interest_rate": 1000,
	  "sbd_print_rate": 10000,
	  "average_block_size": 34,
	  "maximum_block_size": 131072,
	  "current_aslot": 17626027,
	  "recent_slots_filled": "170141183460469231731687303715884105727",
	  "participation_count": 127,
	  "last_irreversible_block_num": 126,
	  "max_virtual_bandwidth": "184968806400000000",
	  "current_reserve_ratio": 7,
	  "vote_regeneration_per_day": 40,
	  "witness_majority_version": "0.18.0",
	  "hardfork_version": "0.18.0",
	  "head_block_num": 129,
	  "head_block_age": "2 seconds old",
	  "participation": "99.21875000000000000",
	  "median_sbd_price": {
	    "base": "0.000 GOLOS",
	    "quote": "0.000 GOLOS"
	  },
	  "account_creation_fee": "0.000 GOLOS",
	  "create_account_min_golos_fee": "0.000 GOLOS",
	  "create_account_min_delegation": "0.000 GOLOS",
	  "create_account_delegation_time": 86400,
	  "min_delegation": "0.000 GOLOS"
	}

	```

2. After that update some parameters:

	```
	update_chain_properties "cyberfounder" {"account_creation_fee":"500.000 GOLOS", "create_account_min_golos_fee":"1.000 GOLOS", "create_account_min_delegation":"1.000 GOLOS", "min_delegation":"5.000 GOLOS"} true
	```
	Result:
	```
	{
	  "ref_block_num": 160,
	  "ref_block_prefix": 3616091231,
	  "expiration": "2018-06-22T11:23:24",
	  "operations": [[
	      "chain_properties_update",{
	        "owner": "cyberfounder",
	        "props": [
	          1,{
	            "account_creation_fee": "500.000 GOLOS",
	            "maximum_block_size": 131072,
	            "sbd_interest_rate": 1000,
	            "create_account_min_golos_fee": "1.000 GOLOS",
	            "create_account_min_delegation": "1.000 GOLOS",
	            "create_account_delegation_time": 86400,
	            "min_delegation": "5.000 GOLOS"
	          }
	        ]
	      }
	    ]
	  ],
	  "extensions": [],
	  "signatures": [
	    "202e5a9b5dbfbffa2dc0088b5061b526abf0f6b285226f064061e9ccd273cd5ddb1739779ca4fc5d4e4a8a89ca3382ea57f861e5b386f0ec38cafa75663ecea240"
	  ],
	  "transaction_id": "35fbcc4d46f0b10e788947c093cfb722bb2d6d8d",
	  "block_num": 161,
	  "transaction_num": 0
	}
	```


3. Then lets update any parameter which we've already changed in previos step. For instance lets' change `min_delegation` and set it to `42`:

	```
	update_chain_properties "cyberfounder" {"min_delegation":"42.000 GOLOS"} true
	```

    Result:
    ```
    {
      "ref_block_num": 175,
      "ref_block_prefix": 3893152779,
      "expiration": "2018-06-22T11:24:09",
      "operations": [[
          "chain_properties_update",{
            "owner": "cyberfounder",
            "props": [
              1,{
                "account_creation_fee": "500.000 GOLOS",
                "maximum_block_size": 131072,
                "sbd_interest_rate": 1000,
                "create_account_min_golos_fee": "1.000 GOLOS",
                "create_account_min_delegation": "1.000 GOLOS",
                "create_account_delegation_time": 86400,
                "min_delegation": "42.000 GOLOS"
              }
            ]
          }
        ]
      ],
      "extensions": [],
      "signatures": [
        "200b0252415b9a2c10d96a564d4be836f2cc10928076b4bc18a35d36a2009f316262ce89d961721433083ad41dbca64839e463aae3151ddcff33f7aeb2f197a23d"
      ],
      "transaction_id": "5c6bef803a0afd875f54c2eee8a3182b0642ed08",
      "block_num": 176,
      "transaction_num": 0
    }
    ```


4. Check info again:

    ```
    info
    ```
    Excepected result:
    ```
    {
      "id": 0,
      "head_block_number": 203,
      "head_block_id": "000000cb6b7cc21e5f81d32daf5b9301bdf951cd",
      "time": "2018-06-22T11:25:03",
      "current_witness": "cyberfounder",
      "total_pow": 10,
      "num_pow_witnesses": 1,
      "virtual_supply": "43306350.390 GOLOS",
      "current_supply": "43306350.390 GOLOS",
      "confidential_supply": "0.000 GOLOS",
      "current_sbd_supply": "0.000 GBG",
      "confidential_sbd_supply": "0.000 GBG",
      "total_vesting_fund_steem": "61.300 GOLOS",
      "total_vesting_shares": "243153.234278 GESTS",
      "total_reward_fund_steem": "81.090 GOLOS",
      "total_reward_shares2": "0",
      "sbd_interest_rate": 1000,
      "sbd_print_rate": 10000,
      "average_block_size": 38,
      "maximum_block_size": 131072,
      "current_aslot": 17626101,
      "recent_slots_filled": "340282366920938463463374607431768211455",
      "participation_count": 128,
      "last_irreversible_block_num": 203,
      "max_virtual_bandwidth": "290665267200000000",
      "current_reserve_ratio": 11,
      "vote_regeneration_per_day": 40,
      "witness_majority_version": "0.18.0",
      "hardfork_version": "0.18.0",
      "head_block_num": 203,
      "head_block_age": "1 second old",
      "participation": "100.00000000000000000",
      "median_sbd_price": {
        "base": "0.000 GOLOS",
        "quote": "0.000 GOLOS"
      },
      "account_creation_fee": "500.000 GOLOS",
      "create_account_min_golos_fee": "1.000 GOLOS",
      "create_account_min_delegation": "1.000 GOLOS",
      "create_account_delegation_time": 86400,
      "min_delegation": "42.000 GOLOS"
    }
    ```

As you can see, previous updates have been saved and reused in update_chain_properties calls. 
