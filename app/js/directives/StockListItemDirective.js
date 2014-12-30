'use strict';

angular.module('stockWatcher.Directives')
	.directive('stockListItem', function() {
		return {
			restrict: 'A',
			scope: {
				quote: '='
			},
			templateUrl: 'views/stockListItem-partial.html',
			controller: 'StockListItemController'
		};
	});
