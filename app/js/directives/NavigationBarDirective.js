'use strict';

angular.module('stockWatcher.Directives')
	.directive('navigationBar', function() {
		return {
			restrict: 'E',
			templateUrl: 'views/navigationBar-partial.html',
			controller: 'RouteController'
		};
	});
