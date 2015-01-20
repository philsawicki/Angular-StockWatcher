'use strict';

angular.module('stockWatcher.Directives')
	.directive('stockAnalystsEstimates', function() {
		return {
			restrict: 'E',
			scope: {
				symbol: '@'
			},
			templateUrl: 'views/stockAnalystsEstimates-partial.html',
			controller: 'StockAnalystsEstimatesController'
		};
	});
