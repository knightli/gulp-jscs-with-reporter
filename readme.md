# gulp-jscs-with-reporter

gulp-jscs plugin, add reporter support.

## Why

as of now, [gulp-jscs](https://github.com/jscs-dev/gulp-jscs) can not support custom report like [gulp-jshint](https://github.com/spalger/gulp-jshint)

i need a custom report, like [gulp-jshint-file-reporter](https://github.com/spalger/gulp-jshint-file-reporter) and [gulp-jshint-html-reporter](https://github.com/ivan-vesely/gulp-jshint-html-reporter)

before offcial support that ( there are already a [pull request](https://github.com/jscs-dev/gulp-jscs/issues/21) and a [issue](https://github.com/jscs-dev/gulp-jscs/issues/21) about that, but as of now those are also waiting merge to master)

i need this feather , so i fork from [gulp-jscs](https://github.com/jscs-dev/gulp-jscs) and add reporter support.

## Install

```sh
$ npm install --save-dev gulp-jscs-with-reporter
```

## Usage

you can use custorm reporter and `jscs` build-in reporter.

### api: `jscs.reporter(reporter, options)`

### use `jscs` build-in reporter

```
gulp.task('lint', function () {

  //jscs build-in reporters:
  // - checkstyle  xml format
  // - console  default, with color in terminal
  // - inline  format inline: `{filename}: line {line}, col {col}, {msg}`
  // - inlinesingle  inline as well
  // - junit  junit xml format
  // - text  plain text
  
  return gulp.src('./lib/**/*.js')
    .pipe(jscs(jsCsConfig))  //jsCsConfig should read from pr
    .pipe(jscs.reporter('inline'))
});
```

jscs build-in reporters (may change, rely on [jscs](http://jscs.info/))

### use custom reporter

```
gulp.task('lint', function () {
  
  return gulp.src('./lib/**/*.js')
    .pipe(jscs(jsCsConfig))  //jsCsConfig should read from pr
    .pipe(jscs.reporter(__dirname + '/gulp-jscs-custom-reporter', {
      filename: __dirname + '/jscs-output.html'
    }));
});
```

** first param **
the `jscs.reporter()` first param report can be a string or a module instance:
1. `__dirname + '/gulp-jscs-html-reporter'`
2. `require(__dirname + '/gulp-jscs-html-reporter')`
all of the two ways work fine!

but you must know if first param is a string ,we will try jscs build-in first, then require it as an module. so if you want to require a module which name is as same as jscs build-in reporter, you should use the second way.

** options **
the options will trans to reporter as a second param.

a reporter stream handler should like this:

```
// this is a transform handle
// - errorsCollection is came from one stream file jscs check
// - options is came from above
module.exports = function( errorsCollection, options ) {
	//handle one stream jscs check result
}
```

** `reporter.beforeAll` and `reporter.afterAll` **

sometimes, in custom reporter, we need do something before jscs checking or after that.
we can use these two funciton binding for that:

```
// this is a init handle
// before first stream came this function will run first
module.exports.beforeAll = function( options ) {
	//do something before all jscs checking
}

// this is a winding up handle
// so we transform all errorCollection in every stream file in the firm param
module.exports.afterAll = function( allErrorsCollection, options ) {
	//do something after all jscs checking and use all collects
}
```

