'use strict';


// Declare "Controllers" module for the app:
angular.module('stockWatcher.Controllers', []);
// Declare "Directives" module for the app:
angular.module('stockWatcher.Directives', []);
// Declare "Filters" module for the app:
angular.module('stockWatcher.Filters', []);
// Declare "Services" module for the app:
angular.module('stockWatcher.Services', []);


// Declare app-level module which depends on views, and components:
angular.module('stockWatcher', [
	'ngRoute',
	'ngAnimate',
	'stockWatcher.Controllers',
	'stockWatcher.Directives',
	'stockWatcher.Services',
	'stockWatcher.Filters'
])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/home-page.html',
				controller: 'HomePageController'
			})
			.when('/about', {
				templateUrl: 'views/about-page.html',
				controller: 'AboutPageController'
			})
			.when('/quote/:stockSymbol', {
				templateUrl: 'views/quoteDetails-page.html',
				controller: 'QuoteDetailsPageController'
			})
			.when('/currency', {
				templateUrl: 'views/currency-page.html',
				controller: 'CurrencyPageController'
			})
			.otherwise({
				redirectTo: '/'
			});
	}])
	// Check online/offline status of the application
	// (From: http://stackoverflow.com/questions/16242389/how-to-check-internet-connection-in-angularjs)
	.run(['$window', '$rootScope', function($window, $rootScope) {
		// If "navigator.onLine" is not found, assume that the app is online:
		var applicationIsOnline = true;
		if (navigator && navigator.onLine) {
			applicationIsOnline = navigator.onLine;
		}
		$rootScope.$apply(function() {
			$rootScope.applicationIsOnline = applicationIsOnline;
		});

		// Add event listeners for "online" & "offline" modes:
		if ($window.addEventListener) {
			$window.addEventListener('online', function() {
				$rootScope.$apply(function() {
					$rootScope.applicationIsOnline = true;
				});
			}, false);
			$window.addEventListener('offline', function() {
				$rootScope.$apply(function() {
					$rootScope.applicationIsOnline = false;
				});
			}, false);
		} else {
			document.body.ononline = function() {
				$rootScope.$apply(function() {
					$rootScope.applicationIsOnline = true;
				});
			};
			document.body.onoffline = function() {
				$rootScope.$apply(function() {
					$rootScope.applicationIsOnline = false;
				});
			};
		}
	}]);
