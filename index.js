#!/usr/bin/env node
'use strict';

const colors = require('colors');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const init = require('./tasks/init');
const serve = require('./tasks/serve');
const timed = require('./tasks/timed');
const logger = require('./logger');

var args = process.argv.slice(2);

if (argIs(args[0], ['h', 'help'])) {
	logger.empty();
	logger.helpEntry('Usage:', 'html-lambda <command>');

	logger.empty();
	logger.helpEntry('Available Commands:');
	logger.empty();

	logger.helpEntry('init [i]:', 'Create a new project in the current directory.');
	logger.helpEntry('serve [s]:', 'Run a local development server.');
	logger.helpEntry('build [b]:', 'Build the lambda into a zip file, but don\'t deploy.');
	logger.helpEntry('deploy [d]:', 'Build and deploy the lambda to the function specified in aws-config.json.');
} else if (argIs(args[0], ['i', 'init'])) {
	init();
} else if (argIs(args[0], ['s', 'serve'])) {
	serve();
} else if (argIs(args[0], ['b', 'build'])) {
	timed.build();
} else if (argIs(args[0], ['d', 'deploy'])) {
	timed.deploy();
} else {
	logger.info('Unrecognized argument:', args[0]);
}

function argIs(arg, aliases) {
	return aliases.indexOf(arg) > -1;
}