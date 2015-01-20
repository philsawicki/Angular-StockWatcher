'use strict';

/**
 * Reverse the given array.
 */
angular.module('stockWatcher.Filters')
	.filter('reverse', function() {
		return function (items) {
			if (typeof items !== 'undefined' && items.constructor === Array) {
				// Create a copy of the array and reverse the order of the items:
				return items.slice().reverse();
			}
			return items;
		};
	});
