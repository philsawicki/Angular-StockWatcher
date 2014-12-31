'use strict';

// This filter makes the assumption that the input will be in decimal form (i.e. 17% is 0.17):
angular.module('stockWatcher.Filters')
	.filter('percentage', ['$filter', function($filter) {
		return function(input, decimals) {
			function isNumber(n) {
				return !isNaN(n) && isFinite(n);
			}

			var parsedInput = parseFloat(input, 10);
			if (isNumber(parsedInput)) {
				var number = $filter('number')(parsedInput, decimals);
				var formattedPercent = /*(number > 0 ? '+' : '') +*/ number + '%';
				
				return formattedPercent;
			}
			return input;
		};
	}]);
