
# golos-tests
Automated tests for Golos Testnet


## Files description
-  Helpers

    ```
        helpers/ - contains all needed wrappers to simplify working with docker and golos api
        ├── docker_helper.js - provides tools for work with docker
        ├── fs_helper.js - provides some usefull functions for working with system features
        ├── golos_helper.js - simplifies work with some golos api methods
        ├── logger.js - simple logger
        └── tests_runner.js - parsing config, searching for `cases.js` to get `Cases` object, running the tests
    ```

- `main.js` - runs 'tests_runner'
- `api_tests/` -- directory wich contains all tests with multiple api calls
- `config_tests/` -- directory wich contains all tests wich need hypervisior's work 
- `api_tests/t123/cases.js` -- test cases for 123 issue
- `config_tests/t456/cases.js` -- test cases for 456 issue
- `config_tests/t456/configs/config42.ini` -- config for 42 testcase of test for 456 issue

## How to run the tests

0.
```
sudo apt-get install nodejs
npm install npm-run
```

1. Globally install Mocha, because tests are based on it. Instructions could be found in the Web.

2. Being in `Qa` directory, run:
```
npm install golos-tests
cd golos-tests
```

3. Check following keys in golos-tests/config.json:
```
containerName
volumeDataDir
configDir
image
```
Container name and image name should be correct docker's ones.
Directories should permit writing.

4. Before running, you should stop and remove the docker container.
```
sudo docker stop golos1
sudo docker rm golos1
```

5. Running of the tests (being in golos-tests):
```
npm-run mocha main.js
```

## How to add a test
Any new test have to be placed in folder `api_tests/` or `config_tests/`. Test cases in `config_test` are needed to test the daemon's behavior with different `config.ini` content and have to work with daemon (docker container) by themselves.
Any test have to support following pattern:
```
api_tests
    └── 123-add-important-feature <-- Issue number + test name
        └── cases.js <-- file with Cases

```

In `cases.js` must be an object `Cases` and added `module.exports.Cases = Cases;`
Example:

```
const logger        =   require('@logger');
const assert        =   require('assert');

const Cases = {
    someTestcase: async (data) => {
        try {
            logger.oklog('case1: Starting testcase');

            assert(2 * 2 == 4);

            logger.oklog('case1: Successfully passed');
            return true;
        }
        catch(err) {
            logger.elog("case1: Failed with error", err.message);
            return false;
        }

    }
};

module.exports.Cases = Cases;

```

## Important!
- `test_runner` searhes exactly `cases.js` file and `Cases` object in it.
- `Cases` object must contain only functions with testscases
- Any testcase from 'Cases' must return `true` in case of success and `false` in case of fail

## Config parameter
`config.ini` contains keys: "api_unit_tests", "api_tests", "config_tests". There have to be describe what tests would be executed. Example:
```
  "api_unit_tests": {

  },

  "api_tests": {
    "32-some-bug-fix": {
      "cases": "all"
    },
    "24-yet-another-issue": {
      "cases": ["noParamsTestCase", "checkThis", "checkThat"]
    },
    "18-test-some-api": {
      "cases": null
    }
  },
  
  "config_tests" : {
    "796-add-storing-content-dept": {
      "cases": "all"
    }  
  }
```

As you can see there are 3 options:
- "all" - all testcases would be run
- null - none of testcases would be run
- ["noParamsTestCase", "checkThis", "checkThat"] - only cases with matching names would be run

That makes possible to configure what issues and what testscases would be tested with by just editing config file. Nothing else is needed. 


# Config tests

The main demand for testcases of this group is to follow naming pattern:
```
const logger        =   require('@logger');
const assert        =   require('assert');

const Cases = {
    // field name MUST be in camelCase
    someTestcase: async (data) => {
        try {
            logger.oklog('case1: Starting testcase');

            assert(2 * 2 == 4);

            logger.oklog('case1: Successfully passed');
            return true;
        }
        catch(err) {
            logger.elog("case1: Failed with error", err.message);
            return false;
        }

    }
};

module.exports.Cases = Cases;
```

And folder with test should look like this:
```
user@pc:~/Qa/golos-tests/config_tests/796-add-storing-content-depth$ ls
cases.js  configs
```
And the config folder must contain all needed configs for testcases. For example for `someTestcase` config.ini file must be named `some_testcase_config.ini`.
