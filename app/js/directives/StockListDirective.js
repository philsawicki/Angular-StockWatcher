'use strict';

angular.module('stockWatcher.Directives')
	.directive('stockList', function() {
		return {
			restrict: 'E',
			templateUrl: 'views/stockList-partial.html',
			controller: 'StockListController'
		};
	});
