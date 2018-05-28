const assert = require('assert');
const Promise = require('bluebird');
const golos = require('golos-js');
const fs = require('fs');
const methodsListJson = fs.readFileSync('swagger.json');
let methodsList = JSON.parse(methodsListJson);
methodsList = methodsList.paths;
delete methodsList['/swagger'];
//golos.config.set('websocket', 'wss://ws.testnet.golos.io');
//golos.config.set('address_prefix', 'GLS');
//golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

let currentMethodIndex = 0;
let methodsListKeys = Object.keys(methodsList);

let camelCase = function(str) {
	return str.replace(/_([a-z])/g, function(_m, l) {
		return l.toUpperCase();
	});
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
				return Promise.delay(1000);
			});
			
			it(methodName, async ()=> {
				console.log('method name: ', methodName);
				return await eval(`golos.api.${methodName}(function(err, result) {
					console.error(err);
					if (currentMethodIndex < methodsListKeys.length) runTestMethod();
				});`);
			});
		});
	}
}

runTestMethod();

//describe('start tests', () => {

	/*afterAll(() => {
		process.exit(-1);
	});*/
	
	/*afterEach(function() {
		console.log('title: ', this.currentTest.title, 'duration: ', this.currentTest.duration + 'ms', 'state: ', this.currentTest.state);
	});*/

//});