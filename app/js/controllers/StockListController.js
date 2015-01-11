'use strict';

/**
 * Stock List Controller.
 */
angular.module('stockWatcher.Controllers')
	.controller('StockListController', ['$scope', '$interval', 'stockService', function($scope, $interval, stockService) {
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
		


		var allYahooSymbols = [];
		for (var i = 0, nbStocks = $scope.quotesToFetch.length; i < nbStocks; i++) {
			allYahooSymbols.push($scope.quotesToFetch[i].yahooSymbol);
		}

		var getCurrentDataWithDetails = function() {
			var promise = stockService.getCurrentDataWithDetails(allYahooSymbols);
			promise.then(function(data) {
				for (var i = 0, count = data.query.count; i < count; i++) {
					$scope.quotesToFetch[i].liveData = data.query.results.row[i];
				}

				$scope.stockQuotes = $scope.quotesToFetch;
			});
		}
		getCurrentDataWithDetails();
		
		
		
		
		
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
		
		var refresher = $scope.createRefresher();
		
		$scope.$on('$destroy', function() {
			// Make sure that the "refresher" $interval is destroyed:
			$scope.destroyRefresher();
        });
	}]);
