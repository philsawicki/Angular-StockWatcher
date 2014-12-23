'use strict';

/* Quote Details Page Controller */
angular.module('myApp.QuoteDetailsPageController', [])
	.controller('QuoteDetailsPageController', ['$scope', '$interval', '$routeParams', 'stockService', function($scope, $interval, $routeParams, stockService) {
		$scope.controllerVersion = '0.0.1';

		$scope.stockSymbol = $routeParams.stockSymbol;

		// Set the default refresh interval for the table:
		$scope.refreshInterval = 30;



		var getDetailedData = function() {
			var stockSymbols = [$scope.stockSymbol];

			var promise = stockService.getCurrentDataWithDetails(stockSymbols);
			promise.then(function(data) {
				console.log(data);

				var dataLines = [];
				var keys = Object.keys(data);
				for (var i = 0, nbKeys = keys.length; i < nbKeys; i++) {
					var key = keys[i];
					var dataLine = [key, data[key]];
					dataLines.push(dataLine);
				}
				
				$scope.stockData = dataLines;
			});
		};

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