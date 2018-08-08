
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

## How to add a test
Any new test have to be placed in folder `api_tests/` or `config_tests/`. Test cases in `config_test` are needed to test the daemon's behavior with different `config.ini` content and have to work with daemon (docker container) by themselves.
Any test have to support following pattern:
```
api_tests
    └── t123 <-- 't' + Issue number
        └── cases.js <-- file with Cases

```

In `cases.js` must be an object `Cases` and added `module.exports.Cases = Cases;`
Example:

```
const logger        =   require('@logger');
const assert        =   require('assert');

const Cases = {
    case1: async (data) => {
        try {
            await logger.oklog('case1: Starting testcase');

            await assert(2 * 2 == 4);

            await logger.oklog('case1: Successfully passed');
            return true;
        }
        catch(err) {
            await logger.elog("case1: Failed with error", err.message);
            return false;
        }

    }
};

module.exports.Cases = Cases;

```

## Important!
- `test_runner` searhes exactly `cases.js` file and `Cases` object in it.
- 'Cases' must contain test cases as functions with name 'case' + N, where N is from [1, inf).
- Any testcase from 'Cases' must return `true` in case of success and `false` in case of fail

## Config parameter
`config.ini` contains keys: "api_unit_tests", "api_tests", "config_tests". There have to be describe what tests would be executed. Example:
```
  "api_unit_tests": {

  },

  "api_tests": {
    "t32": {
      "cases": "all"
    },
    "t24": {
      "cases": ["case1", "case4", "case5"]
    },
    "t18": {
      "cases": null
    }
  },
  
  "config_tests" : {
    "t796": {
      "cases": "all"
    }  
  }
```

As you can see there are 3 options:
- "all" - all testcases would be run
- null - none of testcases would be run
- ["case1", "case4", "case5"] - only cases with numbers 1, 4, 5 would be run

That makes possible to configure what issues and what testscases would be tested with by just editing config file. Nothing else is needed. 
