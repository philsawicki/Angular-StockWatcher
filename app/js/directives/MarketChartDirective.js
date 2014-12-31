'use strict';

angular.module('stockWatcher.Directives')
	.directive('marketChart', function() {
		return {
			restrict: 'E',
			scope: {
				fetchTSX: '@',
				fetchDJ: '@'
			},
			templateUrl: 'views/marketChart-partial.html',
			controller: 'MarketChartController'
		};
	});
