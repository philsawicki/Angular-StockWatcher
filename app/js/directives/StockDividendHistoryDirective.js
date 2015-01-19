'use strict';

angular.module('stockWatcher.Directives')
	.directive('stockDividendHistory', function() {
		return {
			restrict: 'E',
			scope: {
				symbol: '@'
			},
			templateUrl: 'views/stockDividendHistory-partial.html',
			controller: 'StockDividendHistoryController'
		};
	});
