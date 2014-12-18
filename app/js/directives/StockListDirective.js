'use strict';

angular.module('myApp.StockListDirective', [])
	.directive('stockList', function() {
		return {
			restrict: 'E',
			templateUrl: 'views/stockList-partial.html',
			controller: 'StockListController'
		};
	});