'use strict';

// Declare app-level module which depends on views, and components:
angular.module('myApp', [
	'ngRoute',
	'myApp.HomePageController',
	'myApp.AboutPageController',
	'myApp.NavigationBarDirective',
	'myApp.RouteController'
	//'myApp.view1',
	//'myApp.view2',
	//'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'views/home-page.html',
			controller: 'HomePageController'
		})
		.when('/about', {
			templateUrl: 'views/about-page.html',
			controller: 'AboutPageController'
		})
		.otherwise({
			redirectTo: '/home'
		});
}]);
