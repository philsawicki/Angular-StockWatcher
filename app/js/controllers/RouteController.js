'use strict';

/* Route Controller */
angular.module('stockWatcher.Controllers')
	.controller('RouteController', ['$scope', '$route', '$location', function($scope, $route, $location) {
		$scope.$on('$routeChangeSuccess', function(event, current, previous) {
			$scope.controller = $route.current.controller;
		});
	}]);
