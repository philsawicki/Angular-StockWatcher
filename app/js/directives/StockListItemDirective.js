'use strict';

angular.module('myApp.StockListItemDirective', [])
	.directive('stockListItem', function() {
		return {
			restrict: 'A',
			//replace: true,
			scope: {
				quote: '='
			},
			templateUrl: 'views/stockListItem-partial.html',
			controller: 'StockListItemController'
		};
	});