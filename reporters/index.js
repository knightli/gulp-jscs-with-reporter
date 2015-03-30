'use strict';
var PluginError = require('gulp-util').PluginError;
var through = require('through2');
var loadReporter = require('./loadReporter');
var failReporter = require('./fail');

module.exports = function (reporter, options) {
	options = options || {};

	if (reporter === 'fail') {
		return failReporter(options);
	}

	var rpt = loadReporter(reporter);

	if (typeof rpt !== 'function') {
		throw new PluginError('gulp-jscs', 'Invalid reporter');
	}

	if(typeof rpt.beforeAll == 'function') {
		rpt.beforeAll(options);
	}

	var allCollections = [];

	return through.obj(function (file, enc, cb) {

		if (file.jscs && !file.jscs.success) {
			allCollections.push(file.jscs.errors);
			rpt([file.jscs.errors], options);
		}

		cb(null, file);
	}, function(cb) {
		if(typeof rpt.afterAll == 'function') {
			rpt.afterAll(allCollections, options);
		}
		cb();
	});
};
