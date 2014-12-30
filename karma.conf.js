module.exports = function(config) {
    config.set({
        basePath: './',

        files: [
          'app/bower_components/angular/angular.js',
          'app/bower_components/angular-mocks/angular-mocks.js',
          'app/components/**/*.js',
          'app/view*/**/*.js',

          'app/bower_components/html5-boilerplate/js/vendor/modernizr-2.6.2.min.js',
          'app/bower_components/jquery/dist/jquery.js',
          'app/bower_components/angular/angular.js',
          'app/bower_components/angular-route/angular-route.js',
          'app/bower_components/angular-animate/angular-animate.js',
          'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
          'app/js/**/*.js',

          'test/unit/**/*.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
          'karma-chrome-launcher',
          'karma-firefox-launcher',
          'karma-jasmine',
          'karma-junit-reporter'
        ],

        junitReporter: {
          outputFile: 'test_out/unit.xml',
          suite: 'unit'
        }
    });
};
