'use strict';

angular.module('stockWatcher.Directives')
	.directive('sparkline', function() {
		return {
			restrict: 'E',
			scope: {
				symbol: '@',
				exchange: '@',
				yesterdayClosePrice: '@'
			},
			templateUrl: 'views/sparkline-partial.html',
			controller: 'SparklineController'
		};
	});
