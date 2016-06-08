'use strict';

const path = require('path');

let project = (file) => {
	if (!file) return process.cwd();
	return path.join(process.cwd(), file);
}

let lib = (file) => {
	let curModule = Object.keys(require.cache)[0];

	if (!file) return path.dirname(curModule);
	return path.join(path.dirname(curModule, file), file);
}

module.exports = {
	project: project,
	lib: lib
}