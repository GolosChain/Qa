const assert = require('assert');
//const Promise = require('bluebird');
const fs = require('fs');
const methodsListJson = fs.readFileSync('swagger.json');
const methodsList = JSON.parse(methodsListJson);
const golos = require('golos-js');
//golos.config.set('websocket', 'wss://ws.testnet.golos.io');
//golos.config.set('address_prefix', 'GLS');
//golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');


describe('start tests', () => {

	/*beforeEach(() => {
		return Promise.delay(100);
	});*/

	/* for (methodName in methodsList.paths) {
		console.log(methodsList.paths[methodName]);
	} */
	// it runned
	it('get_accounts', async ()=> {
		let accounts = ['epexa'];
		return await golos.api.getDynamicGlobalProperties(function(err, result) {
		//return await golos.api.getAccounts(accounts, function(err, result) {
			//if ( ! err) console.log(result.head_block_number, result.time, result.current_witness);
			//else console.error(err);
			console.log(err, result);
		});
	});

	/*afterAll(() => {
		process.exit(-1);
	});*/
	
	/*afterEach(function() {
		console.log('title: ', this.currentTest.title, 'duration: ', this.currentTest.duration + 'ms', 'state: ', this.currentTest.state);
	});*/

});