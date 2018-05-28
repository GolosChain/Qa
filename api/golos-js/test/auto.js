const assert = require('assert');
const Promise = require('bluebird');
const golos = require('golos-js');
const fs = require('fs');
const methodsListJson = fs.readFileSync('swagger.json');
let methodsList = JSON.parse(methodsListJson);
methodsList = methodsList.paths;
delete methodsList['/swagger'];
/* golos.config.set('websocket', 'wss://ws.testnet.golos.io');
golos.config.set('address_prefix', 'GLS');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679'); */

let currentMethodIndex = 0;
let methodsListKeys = Object.keys(methodsList);

let camelCase = function(str) {
	return str.replace(/_([a-z])/g, function(_m, l) {
		return l.toUpperCase();
	});
}

let getParamVal = function(type, str) {
	if ( ! str) {
		if (type == 'string') str = '';
		else str = 0;
	}
	if (type == 'string' && str.charAt(0) != '[' && str.charAt(0) != '{') str = `'` + str + `'`;
	return str;
}

//for (methodName in methodsList) {

let runTestMethod = function() {
	let methodName = methodsListKeys[currentMethodIndex];
	if (methodName) {
		currentMethodIndex++;
		let method = methodsList[methodName];
		methodName = methodName.substr(1);
		methodName = camelCase(methodName);
		
		// run test method
		describe('start tests', () => {
			
			beforeEach(() => {
				//return Promise.delay(1000);
			});
			
			it(methodName, async ()=> {
				let paramsStr = '';
				if (method.get.parameters) {
					method.get.parameters.forEach(function(param) {
						paramsStr += getParamVal(param.type, param.default);
						paramsStr += ', ';
					});
				}
				let methodNameAndParams = `${method.get.tags.includes('Broadcast') ? 'broadcast' : 'api'}.${methodName}(${paramsStr}`;
				console.log(methodNameAndParams);
				return await eval('golos.' + methodNameAndParams + `function(err, result) {
					//if (err) console.error(err);
				});`);
			});
			
			afterEach(function() {
				//console.log('title: ', this.currentTest.title, 'state: ', this.currentTest.state);
				if (currentMethodIndex < methodsListKeys.length) runTestMethod();
			});
			
			/* afterAll(() => {
				process.exit(-1);
			}); */
			
		});
	}
}

runTestMethod();