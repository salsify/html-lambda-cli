const runner = require('html-lambda-runner');

exports.handler = (event, context, callback) => {
	runner.run(event, context, callback);
};