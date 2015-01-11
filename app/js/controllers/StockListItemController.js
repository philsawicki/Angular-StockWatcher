'use strict';

/**
 * Stock List Item Controller
 */
angular.module('stockWatcher.Controllers')
	.controller('StockListItemController', ['$scope', 'stockService', 'errorMessages', 
		function ($scope, stockService, errorMessages) {
		
		var getLiveData = function() {
			var promise = stockService.getLiveData($scope.quote.symbol, $scope.quote.exchange, $scope.quote.interval, $scope.quote.period);
			promise.then(
				function (data) {
					$scope.liveQuotes = data;
				},

				function (reason) {
					if (reason) {
						var printError = true;

						if (typeof reason.error !== 'undefined') {
							if (reason.error === errorMessages.NoData.Error) {
								printError = false;
							}
						}

						if (printError) {
							console.error('Error while fetching data', reason);
						}
					}
				}
			);
		};
		getLiveData();

		
		$scope.isGain = function(input) {
			if (typeof $scope.quote.liveData.Change !== 'undefined') {
				var changeIsPositive = $scope.quote.liveData.Change[0] === '+';
				return changeIsPositive;
			}
			return false;
		};
		
		$scope.isLoss = function(input) {
			if (typeof $scope.quote.liveData.Change !== 'undefined') {
				var changeIsNegative = $scope.quote.liveData.Change[0] === '-';
				return changeIsNegative;
			}
			return false;
		};
	}]);
