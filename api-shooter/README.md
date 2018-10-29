# About API-shooter #

This is a Node js script which tests golos node API-methods using npms Mocha and Chai.

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