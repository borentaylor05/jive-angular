var browserify    = require('browserify'),
  babelify      = require('babelify'),
  buffer        = require('vinyl-buffer'),
  concat        = require('gulp-concat'),
  dotenv        = require('dotenv'),
  fs            = require('fs'),
  del           = require('del'),
  grepFail      = require('gulp-grep-fail'),
  gulp          = require('gulp'),
  inject        = require('gulp-inject'),
  jscs          = require('gulp-jscs'),
  jshint        = require('gulp-jshint'),
  minify        = require('gulp-minify-css'),
  rev           = require('gulp-rev'),
  revReplace    = require('gulp-rev-replace'),
  runSequence   = require('run-sequence'),
  sass          = require('gulp-sass'),
  cssGlobbing   = require('gulp-css-globbing'),
  bourbon       = require('node-bourbon'),
  source        = require('vinyl-source-stream'),
  templateCache = require('gulp-angular-templatecache'),
  uglify        = require('gulp-uglify'),
  jsonlint      = require('gulp-jsonlint');

var ENV = process.env.NODE_ENV || 'development';

if(fs.existsSync('.env')) {
  dotenv.load();
}

var appBuildTasks = function(){
  return ['dist', 'run'];
};

/* Server *************/

gulp.task('default', ['build', 'watch']);

gulp.task('jive', ['html-jive', 'dist-js-css']);

gulp.task('server', ['connect']);

gulp.task('build', function() {
  runSequence.apply(this, appBuildTasks());
});

gulp.task('connect', function() {
  return require('./server');
});

gulp.task('run', function(){
  var tasks = appBuildTasks();
  tasks.push('server');
  runSequence.apply(this, tasks);
});

gulp.task('watch', function() {
  gulp.watch(['app/**/*.js', '!app/templates.js'], ['jshint', 'js']);
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/css/**/*.scss', ['css']);
  gulp.watch('app/img/**/*', ['img']);
});

/* HTML *************/

gulp.task('html', function(){
  runSequence('html-files', 'html-resource-tags');
});

gulp.task('html-jive', function(){
  runSequence('html-files', 'html-resource-tags-jive');
});

gulp.task('html-files', function() {
  gulp.src("app/**/*.html").pipe(gulp.dest('dist/'));

  return gulp.src(['app/index.html'])
    .pipe(gulp.dest('dist/'));
});

gulp.task('html-resource-tags', function () {
  if(ENV === 'jive'){
    return gulp.src('dist/index.html')
      .pipe(inject(gulp.src(['./dist/js/*.js', './dist/css/*.css']), {
        empty: true, // helpful when running "live" locally
        addRootSlash: false }))
      .pipe(gulp.dest('dist/'));
  }
  else{
    return gulp.src('dist/index.html')
      .pipe(inject(gulp.src(['./dist/js/*.js', './dist/css/*.css']), {
        ignorePath: 'dist/',
        empty: true, // helpful when running "live" locally
        addRootSlash: true }))
      .pipe(gulp.dest('dist/'));
  }
});

gulp.task('html-resource-tags', function () {
  return gulp.src('dist/index.html')
    .pipe(inject(gulp.src(['./dist/js/*.js', './dist/css/*.css']), {
      ignorePath: 'dist/',
      empty: true, // helpful when running "live" locally
      addRootSlash: true }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('html-resource-tags-jive', function(){
  return gulp.src('dist/index.html')
    .pipe(inject(gulp.src(['./dist/js/*.js', './dist/css/*.css']), {
      empty: true, // helpful when running "live" locally
      addRootSlash: false }))
    .pipe(gulp.dest('dist/'));
})

gulp.task('templateCache', function() {
  return gulp.src(['app/**/*.svg', 'app/**/*.html', '!app/index.html'])
    .pipe(templateCache({ standalone: true, moduleSystem: 'browserify' }))
    .pipe(gulp.dest('app'));
});

/* CSS *************/

gulp.task('css', function(){
  del.sync('dist/css/');

  var src = gulp.src('app/scss/main.scss');

  src = src
    .pipe(cssGlobbing({ extensions: '.scss'}))
    .pipe(sass({ includePaths: bourbon.with([
      'app/scss/'
    ]), errLogToConsole: true }))
    .pipe(concat('style.css'));

  if(ENV === 'production') {
    src = src
      .pipe(minify())
      .pipe(rev())
      .pipe(revReplace());
  }

  return src.pipe(gulp.dest('dist/css/'));
});

/* JS ****************/

gulp.task('js', ['templateCache'], function() {
  var browser = browserify()
    .add('./app/modules/app.module.js')
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'));

  if(ENV === 'production') {
    del.sync('dist/js/**'); // helpful when running "live" locally

    browser = browser
      .pipe(annotate())
      .pipe(buffer())
      .pipe(uglify())
      .pipe(rev())
      .pipe(revReplace());
  }

  return browser.pipe(gulp.dest('dist/js'));
});

gulp.task('dist-js-css', ['js', 'css']);

gulp.task('dist', function() {
  runSequence('html', 'dist-js-css');
});

/* Linters *************/

gulp.task('jscs', function() {
  return gulp.src(['*.js', 'app/**/*.js', 'spec/**/*.js', '!app/templates.js', '!app/modules/deploy.constants.js'])
    .pipe(jscs())
    .pipe(jscs.reporter('jshint-stylish'))
    .pipe(jscs.reporter('fail'));
});

gulp.task('grepFail', function () {
  return gulp.src([
    'app/**/*.js', 'app/css/**/*.scss', 'app/**/*.html', 'app/**/*.json',
    'spec/**/*.js', 'spec/**/*.json',
    'features/**/*.rb', 'features/**/*.yml', 'features/**/*.feature', 'features/**/*.js'])
    .pipe(grepFail([
      'it.only', 'describe.only', 'context.only',
      '>>>>', '<<<<', '====' /* looks for merge conflicts */]));
});

gulp.task('jshint', function() {
  return gulp.src(['app/components/**/*.js', 'app/modules/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});