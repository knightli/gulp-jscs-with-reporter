'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var Checker = require('jscs');
var loadConfigFile = require('jscs/lib/cli-config');
var assign = require('object-assign');
var reporter = require('./reporters');

var plugin = module.exports = function (options) {
  options = options || '.jscsrc';

  if (typeof options === 'string') {
    options = {configPath: options};
  }

  options = assign({esnext: false}, options);

  var checker = new Checker({esnext: !!options.esnext});

  checker.registerDefaultRules();

  var configPath = options.configPath;
  delete options.esnext;
  delete options.configPath;

  if (configPath) {
    if (Object.keys(options).length) {
      throw new Error('configPath option is not compatible with code style options');
    }

    checker.configure(loadConfigFile.load(configPath));
  } else {
    checker.configure(options);
  }

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-jscs', 'Streaming not supported'));
      return;
    }

    if (checker.getConfiguration().isFileExcluded(file.path)) {
      cb(null, file);
      return;
    }

    var errors = checker.checkString(file.contents.toString(), file.relative);
    var errorList = errors.getErrorList();

    file.jscs = {
      success: true,
      errorCount: 0,
      errors: []
    };

    if (errorList.length > 0) {
      file.jscs.success = false;
      file.jscs.errorCount = errorList.length;
      file.jscs.errors = errors;
    }

    cb(null, file);
  });
};

plugin.reporter = reporter;
