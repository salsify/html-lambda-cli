'use strict';

let start = () => {
	return process.hrtime();
};

let stop = (start) => {
	let end = process.hrtime(start);
	let time = (end[0] * 1000) + (end[1] / 1000000);

	time = time.toFixed(2);

	if (time >= 1000) {
		time = (time / 1000).toFixed(2);
		time += 's';
	} else {
		time += 'ms';
	}

	return time;
};

module.exports = {
	start: start,
	stop: stop
}