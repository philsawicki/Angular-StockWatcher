'use strict';

angular.module('stockWatcher.Directives')
	.directive('stockNews', function() {
		return {
			restrict: 'E',
			scope: {
				symbol: '@'
			},
			templateUrl: 'views/stockNews-partial.html',
			controller: 'StockNewsController'
		};
	});
