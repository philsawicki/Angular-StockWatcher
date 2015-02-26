// Node modules:
var fs = require('fs'),
    chalk = require('chalk'),
    es = require('event-stream'),
    cs = require('combined-stream');

// Gulp and plugins:
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    htmlReplace = require('gulp-html-replace'),
    templateCache = require('gulp-angular-templatecache'),
    minifyCSS = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html');


/**
 * Package up the Views into a single initial download.
 */
gulp.task('package-partials', function() {
    return gulp.src(['./app/views/**/*.html'])
        .pipe(minifyHTML({ empty: true, quotes: true }))
        .pipe(templateCache('templates.js', { root: 'views/', module: 'stockWatcher' }))
        .pipe(gulp.dest('./tmp'));
});

/**
 * Minify JS.
 */
gulp.task('minify-js', ['package-partials'], function() {
    // Library references (order-dependent):
    var libs = [
        //'./app/bower_components/html5-boilerplate/js/vendor/modernizr-2.6.2.min.js',
        //'./app/bower_components/jquery/dist/jquery.js',
        //'./app/bower_components/angular/angular.js',
        //'./app/bower_components/angular-route/angular-route.js',
        //'./app/bower_components/bootstrap/dist/js/bootstrap.min.js',
        //'./app/bower_components/globalize/lib/globalize.js',
        //'./app/bower_components/globalize/lib/cultures/globalize.culture.en-GB.js',
        //'./app/bower_components/d3/d3.min.js',
        //'./app/bower_components/jquery-mockjax/jquery.mockjax.js'
        
        './app/js/**/*.js',
        './tmp/templates.js'
    ];

    var jsStream = cs.create();
    jsStream.append(gulp.src(libs));

    return jsStream
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});

/**
 * Minify CSS files, rewrite relative paths of Bootstrap fonts & copy Bootstrap fonts.
 */
gulp.task('minify-css', function() {
    var bootstrapBaseCSS = gulp.src('app/bower_components/bootstrap/dist/css/bootstrap.min.css')
            .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
        bootstrapThemeCSS = gulp.src('app/bower_components/bootstrap/dist/css/bootstrap-theme.min.css'),
        applicationCSS = gulp.src('app/css/*.css'),
        combinedStream = cs.create(),
        fontFiles = gulp.src('./app/bower_components/bootstrap/fonts/*', { base: './app/bower_components/bootstrap/' });

    combinedStream.append(bootstrapBaseCSS);
    combinedStream.append(bootstrapThemeCSS);
    combinedStream.append(applicationCSS);

    var combinedCSS = combinedStream
        //.pipe(uncss({
        //    html: ['./app/index.html', './app/views/**/*.html']
        //}))
        .pipe(minifyCSS({ cache: true, keepSpecialComments: 0, advanced: true }))
        .pipe(concat('css.css'));

    return es.concat(combinedCSS, fontFiles)
        .pipe(gulp.dest('./dist/css/'));
});
/**
 * Copy index.html, replacing "<script>" and "<link>" tags to reference production URLs.
 */
gulp.task('minify-html', function() {
    // Minify HTML for the "async" JS loader:
    gulp.src('./app/index-async.html')
        .pipe(htmlReplace({
            css: 'css/css.css',
            js: 'js/scripts.js'
        }))
        .pipe(minifyHTML({ conditionals: true, empty: true, quotes: true })) // There is an issue with IE conditionals being removed with "comments: true".
        .pipe(gulp.dest('./dist/'));

    // Minify HTML for the "sync" JS loader:
    return gulp.src('./app/index.html')
        .pipe(htmlReplace({
            css: 'css/css.css',
            js: 'js/scripts.js'
        }))
        .pipe(minifyHTML({ conditionals: true, empty: true, quotes: true })) // There is an issue with IE conditionals being removed with "comments: true".
        .pipe(gulp.dest('./dist/'));
});

/**
 * Removes all files from "./dist" & "./tmp".
 */
gulp.task('clean', function() {
    return gulp.src(['./dist/**/*', './tmp/**/*'], { read: false })
        .pipe(clean());
});

/**
 * Rerun the tasks when a file changes.
 */
gulp.task('watch', function() {
    gulp.watch(['app/js/**/*.js'], ['minify-js']);
    gulp.watch(['app/css/**/*.css'], ['minify-css']);
    gulp.watch(['app/*.html'], ['minify-html']);
    gulp.watch(['app/views/*.html'], ['minify-js']); // Calls "package-partials" then "minify-js" (for templateCache)
});

/**
 * Build tasks.
 */
gulp.task('build', ['minify-html', 'minify-js', 'minify-css'], function() {
    console.log('\nPlaced optimized files in ' + chalk.magenta('./dist\n'));
});

/**
 * Default task (called when running `gulp` from cli).
 */
gulp.task('default', ['watch'], function (callback) {
    callback();
});
