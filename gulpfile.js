"use strict";
/* jshint node: true */
const gulp = require('gulp');
const babel = require('gulp-babel');
const gulpConcat = require('gulp-concat');
const gulpConnect = require('gulp-connect');
const gulpHint = require('gulp-jshint');



gulp.task('default', ['build']);

gulp.task('connect', () => {
  connect.server();
});
