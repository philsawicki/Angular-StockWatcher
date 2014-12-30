'use strict';

angular.module('stockWatcher.Directives')
	.directive('currencyChart', function() {
		return {
			restrict: 'E',
			scope: {
				fromCurrency: '@',
				toCurrency: '@'
			},
			templateUrl: 'views/currencyChart-partial.html',
			controller: 'CurrencyChartController'
		};
	});
