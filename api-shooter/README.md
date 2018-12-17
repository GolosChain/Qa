# About API-shooter #

This is the NodeJS script which tests golos node API-methods using npm packages Mocha and Chai.

# How does it work #

## Prefiller ##

To test Golos API methods you need to have some data in the blockchain. So we need to fill it with all avaliable data variants, like posts, comments, votes, price_feeds, market trades and etc. So this prefiller has two parts: 
- After cashout  
    Doing some operations and then waiting for cashout. That would give us opportunity to test the whole life cycle of the blockchain.
- Others
    These ones do not need to wait for cashout, for instance in cases when you need some fresh comment

### Executing order ###

- First of all you need to fill testnet with `prefiller.js`. 
- After it would be ready you should copy the blockchain state and save it to `share` folder to use the prefilled data in mocha tests cases. 
- `./run_tests`

### What time does it take to fill testnet and wait cashout? ###

Basicly it's 60 minutes, but you can change it. 
In [**GolosChain/golos**](https://github.com/GolosChain/golos) there is a [**config file**](https://github.com/GolosChain/golos/blob/master/libraries/protocol/include/golos/protocol/config.hpp) which contains the line: 
`#define STEEMIT_CASHOUT_WINDOW_SECONDS          (60*60) /// 1 hour`
Which can be replaced by any value you want. So you build docker image with changed value of `STEEMIT_CASHOUT_WINDOW_SECONDS` if you need to get golos node with fast cashout. It may be usefull for tests.
```
cd golos/
sudo docker build -t goloschain/golos_19hf_fastcashout -f share/golosd/docker/Dockerfile-testnet .
```

After that make needed changes in `config.json`. Look at section "How to configure"

### Tests themselves ###

All test are written using Mocha and Chain and placed in `tests` folder. By the way Mocha test cases are asynchronous funcitons, each of them call certain API mathod one or more times. Of course all parameters are written according to prefilled values. 

# How to use #

Currently there is only option to test docker container. BTW the first todo is to make possible to test remote Golos node, using it's ws address.

## How to configure ##

* First you need to have choose what version of golos node you would like to test. After that you have to write config for docker image with golos you'd like to test.
* Open `config.ini` file. Then take a look at `"defaultDockerContainer-18-4"` field:
    ```
    "defaultDockerContainer-18-4" : {
        "containerName": "golos-default-container",
        "volumeDataDir": "/home/anton/golos_tests/default/chain_data_01",
        "configDir": "/home/anton/golos_tests/default/config/",
        "image": "goloschain/golos:v0.18.4preRC9-testnet",

        "blocklogPath": "./share/default/golosd/blockchain/", 
        "defaultConfigPath": "./share/default/golosd/config/debug_config.ini"
    }
    ```
- `"image"` -- name of the image you've built before running (or image form docker hub)
- `"blocklogPath"` -- path to block log which is needed because when block log is non empty and has passed last HF, then you shouldn't wait to check any api methods response.
- `"defaultConfigPath"` -- path to config you need to put run golos node with
- `"volumeDataDir"` and `"configDir"` -- working derictories. First is for blockchain. Second one is for `config.ini`

- After you've configured docker container, then run `npm install` to install all needed npm packages.

## How to run ##
Just run bash script `run_tests.sh`


# TODO #
- Add config for prefiller. 
    It would be cool if api-shooter could be used to test any golos node. As prefiller and tests are separated it is possible to use mocha tests for api testing without filling the blockchain by yourself. It can be already filled, and be a remote node. All you need is just a websocket address. There is no matter for tests what golos node answers the API calls, so with few modifications this tool can be used to test production node too. What is greate coz it allows to test the production code version and be sured that all API methods do work correctly.
- Add wrap 