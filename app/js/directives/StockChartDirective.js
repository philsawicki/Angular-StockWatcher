'use strict';

angular.module('stockWatcher.Directives')
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
