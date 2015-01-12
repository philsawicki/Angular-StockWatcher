'use strict';

/**
 * Stock List Controller.
 */
angular.module('stockWatcher.Controllers')
	.controller('StockListController', ['$scope', '$interval', 'stockService', 'errorMessages', 
		function ($scope, $interval, stockService, errorMessages) {

		// Set the default refresh interval for the table:
		$scope.refreshInterval = 30;

		// Set the default sort order for the table:
		$scope.sortOrder = 'index';

		// Set the default sort direction for the table:
		$scope.sortReversed = false;
		
		$scope.quotesToFetch = [
			{
				symbol: 'PG',
				yahooSymbol: 'PG',
				//exchange: 'NYSE',
				//interval: 60*15,
				//period: '10d',
				liveData: {},
				index: 0
			},
			{
				symbol: 'T',
				yahooSymbol: 'T.TO',
				//exchange: 'TSE',
				//interval: 60*15,
				//period: '1d',
				liveData: {},
				index: 1
			},
			{
				symbol: 'BNS',
				yahooSymbol: 'BNS.TO',
				//exchange: 'TSE',
				//interval: 60*15,
				//period: '1d',
				liveData: {},
				index: 2
			},
			{
				symbol: 'TD',
				yahooSymbol: 'TD.TO',
				//exchange: 'TSE',
				//interval: 60*15,
				//period: '1d',
				liveData: {},
				index: 3
			},
			{
				symbol: 'PWF',
				yahooSymbol: 'PWF.TO',
				//exchange: 'TSE',
				//interval: 60*15,
				//period: '1d',
				liveData: {},
				index: 4
			},
			{
				symbol: 'FTS',
				yahooSymbol: 'FTS.TO',
				//exchange: 'TSE',
				//interval: 60*15,
				//period: '1d',
				liveData: {},
				index: 5
			},
			{
				symbol: 'BEP',
				yahooSymbol: 'BEP-UN.TO',
				//exchange: 'TSE',
				//interval: 60*15,
				//period: '1d',
				liveData: {},
				index: 6
			},
			{
				symbol: 'EMA',
				yahooSymbol: 'EMA.TO',
				//exchange: 'TSE',
				//interval: 60*15,
				//period: '1d',
				liveData: {},
				index: 7
			},
			{
				symbol: 'XIC',
				yahooSymbol: 'XIC.TO',
				//exchange: 'TSE',
				//interval: 60*15,
				//period: '1d',
				liveData: {},
				index: 8
			},
			{
				symbol: 'XSP',
				yahooSymbol: 'XSP.TO',
				//exchange: 'TSE',
				//interval: 60*15,
				//period: '1d',
				liveData: {},
				index: 9
			}
		];
		$scope.stockQuotes = [];
		



		var getCurrentDataWithDetails = function() {
			var allYahooSymbols = [];
			for (var i = 0, nbStocks = $scope.quotesToFetch.length; i < nbStocks; i++) {
				allYahooSymbols.push($scope.quotesToFetch[i].yahooSymbol);
			}

			var promise = stockService.getCurrentDataWithDetails(allYahooSymbols);
			promise.then(
				function (data) {
					for (var i = 0, count = data.query.count; i < count; i++) {
						$scope.quotesToFetch[i].liveData = data.query.results.row[i];
					}

					$scope.stockQuotes = $scope.quotesToFetch;
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
		getCurrentDataWithDetails();





		$scope.addStockSuggestions = [];

		$scope.$watch('addStockName', function (newValue) {
			if (typeof newValue !== 'undefined') {
				var promise = stockService.getStockSymbol(newValue);
				promise.then(
					function (data) {
						$scope.addStockSuggestions = data;
					},

					function (reason) {
						console.error(reason);
					}
				);
			}
		});




		$scope.selectedStock = undefined;
		$scope.hasSelectedStock = false;

		$scope.setSelectedStock = function(selectedStock) {
			if (typeof selectedStock !== 'undefined') {
				$scope.selectedStock = selectedStock;
				$scope.hasSelectedStock = true;
			} else {
				$scope.setSelectedStock = undefined;
				$scope.hasSelectedStock = false;
				$scope.addStockName = undefined; // Reset the input
				$scope.addStockSuggestions = [];
			}
		};

		$scope.saveSelectedStock = function() {
			// Add the selected symbol to the watchlist:
			$scope.quotesToFetch.push(
				{
					symbol: $scope.selectedStock.symbol,
					yahooSymbol: $scope.selectedStock.symbol,
					//exchange: 'NYSE',
					//interval: 60*15,
					//period: '10d',
					liveData: {},
					index: $scope.quotesToFetch.length
				}
			);

			// Refresh the stock list:
			getCurrentDataWithDetails();

			// Close the modal:
			$scope.setSelectedStock(undefined);
			//$('#addStockModal').modal('hide');
		};
		
		
		
		
		
		$scope.createRefresher = function() {
			return $interval(function() {
				getCurrentDataWithDetails();
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
		
		var refresher = $scope.createRefresher();
		
		$scope.$on('$destroy', function() {
			// Make sure that the "refresher" $interval is destroyed:
			$scope.destroyRefresher();
        });
	}]);
