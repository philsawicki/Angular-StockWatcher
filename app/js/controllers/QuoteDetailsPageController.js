'use strict';

/* Quote Details Page Controller */
angular.module('myApp.QuoteDetailsPageController', [])
	.controller('QuoteDetailsPageController', ['$scope', '$routeParams', function($scope, $routeParams) {
		$scope.controllerVersion = '0.0.1';

		$scope.stockSymbol = $routeParams.stockSymbol;
	}]);