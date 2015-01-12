'use strict';

/**
 * Stock List Controller.
 */
angular.module('stockWatcher.Controllers')
	.controller('StockListController', ['$scope', '$interval', 'stockService', 'errorMessages', 'storageService',
		function ($scope, $interval, stockService, errorMessages, storageService) {

		// Set the default refresh interval for the table:
		$scope.refreshInterval = 30;

		// Set the default sort order for the table:
		$scope.sortOrder = 'index';

		// Set the default sort direction for the table:
		$scope.sortReversed = false;
		

		// Retrieve the quotes to fetch from storage:
		//var savedQuotesKey = 'StockWatcher_quotesToFetch';
		//var savedQuotes = angular.fromJson(storageService.getData(savedQuotesKey));

		$scope.quotesToFetch = /*savedQuotes ||*/ [
			{
				symbol: 'PG',
				yahooSymbol: 'PG',
				liveData: {},
				index: 0
			},
			{
				symbol: 'T',
				yahooSymbol: 'T.TO',
				liveData: {},
				index: 1
			},
			{
				symbol: 'BNS',
				yahooSymbol: 'BNS.TO',
				liveData: {},
				index: 2
			},
			{
				symbol: 'TD',
				yahooSymbol: 'TD.TO',
				liveData: {},
				index: 3
			},
			{
				symbol: 'PWF',
				yahooSymbol: 'PWF.TO',
				liveData: {},
				index: 4
			},
			{
				symbol: 'FTS',
				yahooSymbol: 'FTS.TO',
				liveData: {},
				index: 5
			},
			{
				symbol: 'BEP',
				yahooSymbol: 'BEP-UN.TO',
				liveData: {},
				index: 6
			},
			{
				symbol: 'EMA',
				yahooSymbol: 'EMA.TO',
				liveData: {},
				index: 7
			},
			{
				symbol: 'XIC',
				yahooSymbol: 'XIC.TO',
				liveData: {},
				index: 8
			},
			{
				symbol: 'XSP',
				yahooSymbol: 'XSP.TO',
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
				$scope.selectedStock = undefined;
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
					liveData: {},
					index: $scope.quotesToFetch.length
				}
			);

			// Store the updated quotes to fetch:
			var quotesToSerialize = [];
			for (var i = 0, nbQuotes = $scope.quotesToFetch.length; i < nbQuotes; i++) {
				var data = $scope.quotesToFetch[i];

				quotesToSerialize.push({
					symbol: data.symbol,
					yahooSymbol: data.yahooSymbol,
					liveData: {},
					index: data.index
				});
			}
			storageService.setData(savedQuotesKey, angular.toJson(quotesToSerialize));

			// Refresh the stock list:
			getCurrentDataWithDetails();

			// Close Modal:
			$scope.closeAddStockModal();
		};

		$scope.closeAddStockModal = function() {
			// Reset saved data:
			$scope.setSelectedStock(undefined);
		}
		
		
		
		
		
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
