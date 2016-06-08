'use strict';

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const build = require('./build');
const deploy = require('./deploy');
const timer = require('../timer');
const logger = require('../logger');

let _build = async (() => {
	let clock = timer.start();
	await (build.full());
	logger.done('Done in ' + timer.stop(clock));
});

let _deploy = async(() => {
	let clock = timer.start();

	let buildName = await (build.full());
	await (deploy(buildName));

	logger.done('Done in ' + timer.stop(clock));
});

module.exports = {
	build: _build,
	deploy: _deploy
}