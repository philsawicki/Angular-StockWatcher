'use strict';

/* Stock List Item Controller */
angular.module('myApp.StockListItemController', [])
	.controller('StockListItemController', ['$scope', 'stockService', function($scope, stockService) {
		var getLiveData = function() {
			var promise = stockService.getLiveData($scope.quote.symbol, $scope.quote.exchange, $scope.quote.interval, $scope.quote.period);
			promise.then(function(data) {
				$scope.liveQuotes = data;
			});
		};
		getLiveData();
	}]);