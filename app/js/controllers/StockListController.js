'use strict';

/* Stock List Controller */
angular.module('myApp.StockListController', [])
	.controller('StockListController', ['$scope', '$interval', 'stockService', function($scope, $interval, stockService) {
		/*
		var symbol    = 'GOOG';
		var startDate = '2014-12-08';
		var endDate   = '2014-12-12';
		
		
		var getHistoricalData = function() {
			var promise = stockService.getHistoricalData(symbol, startDate, endDate);
			promise.then(function(data) {
				$scope.quotes = data;
			});
		};
		getHistoricalData();
		*/
		
		var stockQuotes = [
			{
				symbol: 'PG',
				yahooSymbol: 'PG',
				exchange: 'NYSE',
				interval: 60*15,
				period: '10d',
				liveData: {}
			},
			{
				symbol: 'T',
				yahooSymbol: 'T.TO',
				exchange: 'TSE',
				interval: 60*15,
				period: '1d',
				liveData: {}
			},
			{
				symbol: 'BNS',
				yahooSymbol: 'BNS.TO',
				exchange: 'TSE',
				interval: 60*15,
				period: '1d',
				liveData: {}
			},
			{
				symbol: 'TD',
				yahooSymbol: 'TD.TO',
				exchange: 'TSE',
				interval: 60*15,
				period: '1d',
				liveData: {}
			},
			{
				symbol: 'PWF',
				yahooSymbol: 'PWF.TO',
				exchange: 'TSE',
				interval: 60*15,
				period: '1d',
				liveData: {}
			},
			{
				symbol: 'FTS',
				yahooSymbol: 'FTS.TO',
				exchange: 'TSE',
				interval: 60*15,
				period: '1d',
				liveData: {}
			},
			{
				symbol: 'BEP',
				yahooSymbol: 'BEP-UN.TO',
				exchange: 'TSE',
				interval: 60*15,
				period: '1d',
				liveData: {}
			},
			{
				symbol: 'EMA',
				yahooSymbol: 'EMA.TO',
				exchange: 'TSE',
				interval: 60*15,
				period: '1d',
				liveData: {}
			},
			{
				symbol: 'XIC',
				yahooSymbol: 'XIC.TO',
				exchange: 'TSE',
				interval: 60*15,
				period: '1d',
				liveData: {}
			},
			{
				symbol: 'XSP',
				yahooSymbol: 'XSP.TO',
				exchange: 'TSE',
				interval: 60*15,
				period: '1d',
				liveData: {}
			}
		];
		
		$scope.stockQuotes = stockQuotes;
		
		
		var symbol = 'T';
		var exchange = 'TSE';
		var interval = 60*15;
		var period = '1d';
		// Google Finance URL for this stock would be:
		// http://www.google.com/finance/getprices?q=T&x=TSE&i=60&p=10d&f=d,c,v,k,o,h,l&df=cpct&auto=0&ei=Ef6XUYDfCqSTiAKEMg
		
		var getLiveData = function() {
			var promise = stockService.getLiveData(symbol, exchange, interval, period);
			promise.then(function(data) {
				$scope.liveQuotes = data;
			});
		};
		getLiveData();
		
		
		
		
		var allYahooSymbols = [];
		for (var i = 0, nbStocks = stockQuotes.length; i < nbStocks; i++) {
			allYahooSymbols.push(stockQuotes[i].yahooSymbol);
		}
		
		var getCurrentData = function() {
			var promise = stockService.getCurrentData(allYahooSymbols);
			promise.then(function(data) {
				console.log(data);
				
				for (var i = 0, count = data.length; i < count; i++) {
					var stockData = data[i];
					$scope.stockQuotes[i].liveData = stockData;
				}
			});
		};
		getCurrentData();
		
		
		
		
		var refresher = $interval(function() {
			getCurrentData();
		}, 30*1000);
		
		$scope.destroyRefresher = function() {
			if (angular.isDefined(refresher)) {
				$interval.cancel(refresher);
				refresher = undefined;
			}
		};
		
		$scope.$on('$destroy', function() {
			// Make sure that the "refresher" $interval is destroyed:
			$scope.destroyRefresher();
        });
	}]);