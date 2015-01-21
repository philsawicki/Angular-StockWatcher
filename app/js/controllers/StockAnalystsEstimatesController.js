'use strict';

/**
 * Stock Analysts Estimates Controller.
 */
angular.module('stockWatcher.Controllers')
	.controller('StockAnalystsEstimatesController', ['$scope', '$interval', 'stockService', 'errorMessages', 
		function ($scope, $interval, stockService, errorMessages) {

		// Set the initial data:
		//$scope.data = {};

		var getAnalystsEstimatesForStock = function() {
			var promise = stockService.getAnalystEstimatesForStock($scope.symbol);
			promise.then(
				function (data) {
					// Format data:

					$scope.data = data;
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
		}
		getAnalystsEstimatesForStock();
	}]);
