'use strict';

/**
 * Quote Details Page Controller
 */
angular.module('stockWatcher.Controllers')
	.controller('QuoteDetailsPageController', ['$scope', '$interval', '$routeParams', '$location', 'stockService', 'errorMessages', 
		function ($scope, $interval, $routeParams, $location, stockService, errorMessages) {

		$scope.$location = $location;

		$scope.stockSymbol = $routeParams.stockSymbol;

		// Set the default refresh interval for the table:
		$scope.refreshInterval = 30;



		var getDetailedData = function() {
			var stockSymbols = [$scope.stockSymbol];

			var promise = stockService.getCurrentDataWithDetails(stockSymbols);
			promise.then(
				function (data) {
					$scope.stockData = data.query.results.row;
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
		getDetailedData();

		$scope.createRefresher = function() {
			return $interval(function() {
				getDetailedData();
			}, $scope.refreshInterval*1000);
		};
		
		$scope.destroyRefresher = function() {
			if (angular.isDefined(refresher)) {
				$interval.cancel(refresher);
				refresher = undefined;
			}
		};
		
		$scope.refreshIntervalChanged = function() {
			$scope.destroyRefresher();
			$scope.createRefresher();
		};
		
		var refresher = $scope.createRefresher();
		
		$scope.$on('$destroy', function() {
			// Make sure that the "refresher" $interval is destroyed:
			$scope.destroyRefresher();
        });
	}]);
