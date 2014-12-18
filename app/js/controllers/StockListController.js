'use strict';

/* Stock List Controller */
angular.module('myApp.StockListController', [])
	.controller('StockListController', ['$scope', 'stockService', function($scope, stockService) {
		var symbol    = 'GOOG';
		var startDate = '2014-12-08';
		var endDate   = '2014-12-12';
		
		$scope.quotes = [];
		
		var getHistoricalData = function() {
			var promise = stockService.getHistoricalData(symbol, startDate, endDate);
			promise.then(function(data) {
				$scope.quotes = data;
			});
		};
		getHistoricalData();
		
		
		symbol = 'T';
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
	}]);