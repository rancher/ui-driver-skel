/* jshint node: true */
const gulp        = require('gulp');
const clean       = require('gulp-clean');
const gulpConcat  = require('gulp-concat');
const gulpConnect = require('gulp-connect');
const emCompiler  = require('./bower_components/ember/ember-template-compiler');
const htmlbars    = require('gulp-htmlbars-compiler');
const wrapAmd     = require('gulp-wrap-amd');
const replace     = require('gulp-replace');
const argv        = require('yargs').argv;


const DIST        = 'dist/';
const TMP         = 'tmp/';
let DRIVER_NAME   = argv.name;

if (!DRIVER_NAME) {
  console.log('Please include a driver name with the --name flag');
  return false;
}

gulp.task('server', ['build'], function() {
  return gulpConnect.server({
    root: [DIST],
    port: process.env.PORT || 3000
  });
});

gulp.task('clean', function() {
  return gulp.src([DIST, TMP], {read: false})
  .pipe(clean());
});

gulp.task('js', ['clean'], function() {
  return gulp.src([
    'components/*.js'
  ])
  .pipe(replace(
    '<driver-name>', DRIVER_NAME
  ))
  .pipe(gulpConcat('component.js',{newLine: ';\n'}))
  .pipe(gulp.dest(TMP));
});

gulp.task('templates', ['js'], function() {
  return gulp.src('components/**/*.hbs')
  .pipe(htmlbars({compiler: emCompiler}))
  .pipe(wrapAmd({
    deps: ['exports', 'ember', 'ui/mixins/driver'],
    params: ['exports', '_ember', '_uiMixinsDriver'],
    moduleRoot: 'component/',
    modulePrefix: 'ui/components/drivers/'
  }))
  .pipe(replace(
    "return Ember.TEMPLATES['template']", 'exports["default"]'
  ))
  .pipe(replace(
    '../components', DRIVER_NAME
  ))
  .pipe(gulpConcat('template.js'), {newLine: ';\n'})
  .pipe(gulp.dest(TMP));
});

gulp.task('build', ['templates'], function() {
  return gulp.src([`${TMP}/*.js`])
  .pipe(gulpConcat('component.js',{newLine: ';\n'}))
  .pipe(gulp.dest(DIST));

});
