'use strict';

angular.module('myApp.StockChartDirective', [])
	.directive('stockChart', function() {
		return {
			restrict: 'E',
			scope: {
				symbol: '@'
			},
			templateUrl: 'views/stockChart-partial.html',
			controller: 'StockChartController'
		};
	});