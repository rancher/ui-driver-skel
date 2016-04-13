"use strict";
/* jshint node: true */
const gulp        = require('gulp');
const clean = require('gulp-clean');
const babel       = require('gulp-babel');
const gulpConcat  = require('gulp-concat');
const gulpConnect = require('gulp-connect');
const gulpHint    = require('gulp-jshint');
const gulpMap     = require('gulp-sourcemaps');
const emCompiler  = require('./bower_components/ember/ember-template-compiler');
const htmlbars    = require('gulp-htmlbars-compiler');
//const defineModule = require('gulp-define-module');
var wrapAmd = require('gulp-wrap-amd');
var replace = require('gulp-replace');
//var handlebars = require('gulp-handlebars');
//var Htmlbars = require('ember-cli-htmlbars');
//var compiler = new Htmlbars();


const pkg = require('./package.json');

const DIST = 'dist/';
const TMP  = 'tmp/';
let VERSION_DIST = DIST+pkg.version+'/';


gulp.task('clean', function() {
  return gulp.src([DIST, TMP], {read: false})
  .pipe(clean());
});


gulp.task('server', ['build'], function() {
  return gulpConnect.server({
    root: [DIST],
    port: process.env.PORT || 3000
  });
});

gulp.task('js', ['clean'], function() {
  return gulp.src([
    'component/*.js'
  ])
  .pipe(babel({
    presets: ['es2015-without-strict']
  }))
  .pipe(gulpConcat('component.js',{newLine: ';\n'}))
  .pipe(gulp.dest(TMP));
});

gulp.task('templates', ['js'], function() {
  // Load templates from the source/templates/ folder relative to where gulp was executed
  return gulp.src('component/**/*.hbs')
  // Compile each Handlebars template source file to a template function using Ember's Handlebars
  //.pipe(handlebars({
  //handlebars: require('ember-handlebars'),
  //compiler: compiler.processString
  //}))
  .pipe(htmlbars({compiler: emCompiler}))
  // Concatenate down to a single file
  .pipe(gulpConcat('template.js'))
  // Write the output into the templates folder
  .pipe(gulp.dest(TMP));
});

gulp.task('build', ['templates'], function() {
  return gulp.src([`${TMP}/*.js`])
  .pipe(wrapAmd({
    deps: ['exports'],          // dependency array
    params: ['exports'],        // params for callback
    moduleRoot: 'component/',
    modulePrefix: 'ui/components/drivers/'
  }))
  .pipe(replace(
    "return Ember.TEMPLATES['driver-template']", 'exports["default"]'
  ))
  .pipe(gulpConcat('component.js',{newLine: ';\n'}))
  .pipe(gulp.dest(DIST));

});

//gulp.task('templates', function() {
//return gulp.src(['component/*.hbs'])
//.pipe(htmlbars({compiler: emCompiler}))
//.pipe(defineModule('amd'))
//.pipe(gulpConcat('driver-template.js',{newLine: ';\n'}))
//.pipe(gulp.dest(TMP));
//});
