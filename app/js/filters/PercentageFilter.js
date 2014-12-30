'use strict';

// This filter makes the assumption that the input will be in decimal form (i.e. 17% is 0.17):
angular.module('stockWatcher.Filters')
	.filter('percentage', ['$filter', function($filter) {
		return function (input, decimals) {
			input = parseFloat(input);
			var number = $filter('number')(input, decimals);
			var formattedPercent = (number > 0 ? '+' : '') + number + '%';
			
			return formattedPercent;
		};
	}]);
