'use strict';

/**
 * Stock Dividend History Controller.
 */
angular.module('stockWatcher.Controllers')
	.controller('StockDividendHistoryController', ['$scope', '$interval', 'stockService', 'errorMessages', 
		function ($scope, $interval, stockService, errorMessages) {

		// Set the default refresh interval for the table:
		//$scope.refreshInterval = 60;

		// Set the initial list of news items:
		$scope.dividendHistory = [];

		var now = new Date();
		var startDate = [
			now.getFullYear() - 5,
			(now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1),
			(now.getDate() < 10 ? '0' : '') + (now.getDate())
		].join('-');
		var endDate = [
			now.getFullYear(),
			(now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1),
			(now.getDate() < 10 ? '0' : '') + (now.getDate())
		].join('-');


		var getDividendHistoryForStock = function() {
			var promise = stockService.getDividendHistoryForStock($scope.symbol, startDate, endDate);
			promise.then(
				function (data) {
					$scope.dividendHistory = data;
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
		getDividendHistoryForStock();



		
		
		$scope.createRefresher = function() {
			return $interval(function() {
				getDividendHistoryForStock();
			}, $scope.refreshInterval*1000);
		};
		
		$scope.destroyRefresher = function() {
			if (typeof refresher !== 'undefined') {
				$interval.cancel(refresher);
				refresher = undefined;
			}
		};
		
		$scope.refreshIntervalChanged = function() {
			$scope.destroyRefresher();
			$scope.createRefresher();
		};

		$scope.setRefreshInterval = function(interval) {
			$scope.refreshInterval = interval;
			$scope.refreshIntervalChanged();
		};
		
		//var refresher = $scope.createRefresher();
		
		$scope.$on('$destroy', function() {
			// Make sure that the "refresher" $interval is destroyed:
			$scope.destroyRefresher();
        });
	}]);
