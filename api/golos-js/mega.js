const mocha = require('mocha');
module.exports = MyReporter;


var testsInfo = {
	pass: [],
	fail: [],
};

function MyReporter(runner) {
	
	mocha.reporters.Base.call(this, runner);
	var passes = 0;
	var failures = 0;
	var streams = {};
	var lastTestDuration;

	runner.on('pass', function(test) {
		passes++;
		let addInfo = test.title.split('|');
		//testsInfo.pass.push([new Date(), test.duration]);
		//testsInfo.pass.push([passes, test.duration]);
		if ( ! streams[addInfo[0]]) {
			streams[addInfo[0]] = true;
			testsInfo.pass.push([passes, 1]);
		}
		else if (test.duration < 20) {
			testsInfo.pass.push([passes, test.duration]);
			lastTestDuration = test.duration;
		}
		else {
			testsInfo.pass.push([passes, lastTestDuration]);
		}
		console.log('pass | title: %s | state: %s | duration: %dms', test.title, test.state, test.duration);
	});

	runner.on('fail', function(test, err) {
		//testsInfo.fail.push(test);
		console.log('fail: %s -- error: %s', test.fullTitle(), err.message);
	});

	runner.on('end', function(tests) {
		console.log(tests);
		//console.log('tests: %d | passes: %d | failures: %d | start: %s | end: %s | duration: %ds', tests.reporter.stats.tests, tests.reporter.stats.passes, tests.reporter.stats.failures, tests.reporter.stats.start, tests.reporter.stats.end, (tests.reporter.stats.duration / 1000).toFixed(2));
		//console.log('end: %d/%d', passes, passes + failures);
		//process.exit(failures);
		//testsInfo.general = tests.reporter.stats;
	});
	
}