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
    htmlreplace = require('gulp-html-replace'),
    templateCache = require('gulp-angular-templatecache'),
    minifyCSS = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html');


/**
 * Package up the Views into a single initial download.
 */
gulp.task('package-partials', function() {
    return gulp.src(['./app/views/**/*.html'])
        .pipe(minifyHTML({ empty: true, quotes: true }))
        .pipe(templateCache('templates.js', { root: 'views/', module: 'myApp' }))
        .pipe(gulp.dest('./tmp'));
});

/**
 * Minify CSS.
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
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('./dist/js/'));
});

/**
 * Minify CSS files, rewrite relative paths of Bootstrap fonts & copy Bootstrap fonts.
 */
gulp.task('minify-css', function() {
    var bowerCss = gulp.src('app/bower_components/bootstrap/dist/css/bootstrap.min.css')
            .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
        appCss = gulp.src('app/css/*.css').pipe(minifyCSS()),
        combinedStream = cs.create(),
        fontFiles = gulp.src('./app/bower_components/bootstrap/fonts/*', { base: './app/bower_components/bootstrap/' });

    combinedStream.append(bowerCss);
    combinedStream.append(appCss);
    combinedCss = combinedStream.pipe(concat('css.css'));

    return es.concat(combinedCss, fontFiles)
        .pipe(gulp.dest('./dist/css/'));
});

/**
 * Copy index.html, replacing "<script>" and "<link>" tags to reference production URLs.
 */
gulp.task('minify-html', function() {
	return gulp.src('./app/index.html')
		.pipe(htmlreplace({
			'css': 'css/css.css',
			'js': 'js/scripts.js'
		}))
		.pipe(minifyHTML({ comments: true, empty: true, quotes: true }))
		.pipe(gulp.dest('./dist/'));
});

/**
 * Removes all files from ./dist & ./tmp.
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
    gulp.watch(['app/views/*.html'], ['package-partials']);
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
gulp.task('default', ['watch'], function(callback) {
    callback();
});
