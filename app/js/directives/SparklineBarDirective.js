'use strict';

angular.module('stockWatcher.Directives')
	.directive('sparklineBar', function() {
		return {
			restrict: 'E',
			scope: {
				symbol: '@',
				min: '@',
				max: '@',
				current: '@'
			},
			templateUrl: 'views/sparklineBar-partial.html',
			controller: 'SparklineBarController'
		};
	});
