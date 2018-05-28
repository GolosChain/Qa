const mocha = require('mocha');
module.exports = MyReporter;


function MyReporter(runner) {
	
	mocha.reporters.Base.call(this, runner);
	var passes = 0;
	var failures = 0;

	runner.on('pass', function(test) {
		passes++;
		console.log('pass | title: %s | state: %s', test.title, test.state);
	});

	runner.on('fail', function(test, err) {
		failures++;
		console.error('\x1b[31m', 'FAIL! ', test.fullTitle(), '-- error: ', err.message, '\x1b[0m');
	});

	runner.on('end', function(tests) {
		console.log('END ', tests);
		//console.log('tests: %d | passes: %d | failures: %d | start: %s | end: %s | duration: %ds', tests.reporter.stats.tests, tests.reporter.stats.passes, tests.reporter.stats.failures, tests.reporter.stats.start, tests.reporter.stats.end, (tests.reporter.stats.duration / 1000).toFixed(2));
		//console.log('end: %d/%d', passes, passes + failures);
		//process.exit(failures);
	});
	
}