'use strict';

// Declare app-level module which depends on views, and components:
angular.module('myApp', [
	'ngRoute',
	'myApp.HomePageController',
	'myApp.AboutPageController',
	'myApp.NavigationBarDirective',
	'myApp.RouteController',
	'myApp.StockService',
	'myApp.StockListDirective',
	'myApp.StockListController',
	'myApp.StockListItemDirective',
	'myApp.StockListItemController'
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
			.otherwise({
				redirectTo: '/'
			});
	}]);
