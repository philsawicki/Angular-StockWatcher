'use strict';

angular.module('stockWatcher.Directives')
	.directive('marketChartWidget', function() {
		return {
			restrict: 'E',
			scope: {
				fetchTSX: '@',
				fetchDJ: '@'
			},
			templateUrl: 'views/marketChartWidget-partial.html',
			controller: 'MarketChartWidgetController'
		};
	});
