'use strict';

const colors = require('colors');

let empty = () => {
	console.log('');
};

let error = (message) => {
	console.log('error:'.bold.red, message);
};

let warning = (message) => {
	console.log('warning:'.bold.yellow, message);
};

let info = (event, message) => {
	console.log(event.green, message);
};

let step = (step) => {
	console.log(step.bold.magenta);
};

let done = (step) => {
	empty();
	console.log(step.bold.underline.cyan);
	empty();
};

let helpEntry = (entry, message) => {
	console.log(entry.bold, message);
}

module.exports = {
	error: error,
	warning: warning,
	info: info,
	step: step,
	done: done,
	helpEntry: helpEntry,
	empty: empty
}