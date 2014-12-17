'use strict';

angular.module('myApp.NavigationBarDirective', [])
	.directive('navigationBar', function() {
		return {
			restrict: 'E',
			templateUrl: 'views/navigationBar-partial.html',
			controller: 'RouteController'
		};
	});