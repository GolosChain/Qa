# simple-api

(Beta-version)

Simple browser tool to access Golos Websocket API. It doesn't need `golos.js` and creates requests itself.

## Usage

1. Open `index.html` in browser
2. Select node (and optionally change API version)
    * New nodes can be defined in `const NODES`
3. Set api method parameters and click button with it's name to call method
4. Results will appear in developer console

**Note:** Simple auto-reconnect on connection lost supported.
To reconnect manually, just click node's radio button again.

## Customization

### Modifying api
Each api version defined in arbitrary file, named `api-{VERSION}.js`.
API names and methods defined inside, the format is mostly self explanatory,
except "parameters fixers" and "optional parameters".

#### Optional parameters
Optional parameter's name starts with `?` symbol:
```
get_vesting_delegations:	["account", "from", "?limit", "?type"]
```
If such parameters not set (empty string), they will not be sent in request.

**Note:** not all actually optional API parameters marked as optional in `api-{VERSION}.js`. Needs to be updated.

#### Parameter fixers
Most parameters are sent as string and transformed to required type inside node.
Some API methods accept arrays or objects parameters (e.g. `get_accounts` requires array).

To solve this, each API definition contains `paramFixes` object.
Keys of this object are method names, and values are functions, accepting string parameters and building required object.

**Note:** some methods don't have required fixers for now.

### Adding new api version
To create new api version, add new `api-{VERSION}.js` file and update `let APIS = ['0.17', '0.18'],` in api.js.  
Fix `function normApi(x, needIdx)` and `const NODES` to allow auto-switch to this version on node select.

## Broadcast API
Broadcast api is not supported for now (needs binary serialization and signing to send any ops).
It may work with signed transactions, but probably needs parameter fixer for it.
