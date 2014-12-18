'use strict';

angular.module('myApp.StockService', [])
	.factory('stockService', ['$q', '$http', function($q, $http) {
		var getHistoricalData = function(symbol, startDate, endDate) {
			var deferred = $q.defer();
			
			var format = '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK';
			var query = 'select * from yahoo.finance.historicaldata where symbol = "' + symbol + '" and startDate = "' + startDate + '" and endDate = "' + endDate + '"';
			var url = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + format;
			
			$http.jsonp(url).success(function(json) {
				var quotes = [];
				
				if (json.query.count > 0) {
					// TODO: Filter & format quotes:
					quotes = json.query.results.quote;
				}
				
				deferred.resolve(quotes);
			});
			
			return deferred.promise;
		};
		
		var getLiveData = function(symbol, exchange, interval, period) {
			var deferred = $q.defer();
			
			var maxTimestamp = 0;
			
			var googleFinanceURL = 'http://www.google.com/finance/getprices?q=' + symbol + '&x=' + exchange + '&i=' + interval + '&p=' + period + '&f=d,c,v,k,o,h,l&df=cpct&auto=0&ei=Ef6XUYDfCqSTiAKEMg';
			var yqlQuery = 'SELECT * FROM csv WHERE url="' + googleFinanceURL + '"';
			var yqlURL = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(yqlQuery) + '&format=json&callback=JSON_CALLBACK';
			
			$http.jsonp(yqlURL).success(function(data) {
				var quotes = [];
				var now = new Date();
				
				if (data.query && data.query.count > 0) {
					var timezoneOffset = parseInt(data.query.results.row[6].col0.replace('TIMEZONE_OFFSET=', ''), 10); // in minutes
					
					var startTimestamp = parseInt(data.query.results.row[7].col0.replace('a', ''), 10) + timezoneOffset * 60;
					var offset = 0;
					
					var chartNeedsRedraw = false;
					for (var i = 7; i < data.query.count; i++) {
						if (data.query.results.row[i].col0[0] === 'a') {
							startTimestamp = parseInt(data.query.results.row[i].col0.replace('a', ''), 10) + timezoneOffset * 60;
							offset = 0;
						} else {
							offset = parseInt(data.query.results.row[i].col0, 10);
						}
						//var date = new Date(startTimestamp + offset * interval).getTime()*1000;
						var date = new Date((startTimestamp + offset * interval + now.getTimezoneOffset() * 60)*1000);
						
						if (date > maxTimestamp) {
							var close = parseFloat(data.query.results.row[i].col1);
							var dataRow = [date, close];
							
							maxTimestamp = date;
							
							quotes.push(dataRow);
						}
					}
				}
				
				deferred.resolve(quotes);
			});
			
			return deferred.promise;
		};
		
		return {
			getHistoricalData: getHistoricalData,
			getLiveData: getLiveData
		};
	}]);