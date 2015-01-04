'use strict';

angular.module('stockWatcher.Services')
	.factory('currencyService', ['$q', '$http', function($q, $http) {
		/**
		 * Gets the currency exchange rate between the to given commodities.
		 * @param  {string}  fromCurrency The currency to convert from (eg: "USD").
		 * @param  {string}  toCurrency   The currency to convert to (eg: "CAD").
		 * @return {Deferred.promise}     A promise to be resolved when the request is successfully received.
		 */
		var getCurrencyExchangeRate = function(fromCurrency, toCurrency) {
			var deferred = $q.defer();
			
			var query = 'select * from yahoo.finance.xchange where pair in ("' + fromCurrency + toCurrency + '")';
			var format = '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK';
			var url = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + format;
			
			$http.jsonp(url).success(function(json) {
				var exchangeRate = {};
				
				if (json.query.count > 0) {
					exchangeRate = json.query.results.rate;

					// Format data:
					exchangeRate.Ask = parseFloat(exchangeRate.Ask, 10);
					exchangeRate.Bid = parseFloat(exchangeRate.Bid, 10);
					exchangeRate.Rate = parseFloat(exchangeRate.Rate, 10);
				}
				
				deferred.resolve(exchangeRate);
			});
			
			return deferred.promise;
		};


		/**
		 * Gets historical currency exchange rate between the two given commodities, between the given dates.
		 * @param  {string}  fromCurrency The currency to convert from (eg: "USD").
		 * @param  {string}  toCurrency   The currency to convert to (eg: "CAD").
		 * @param  {string}  startDate    The start date for historical data (eg: "2014-12-01").
		 * @param  {string}  endDate      The end date for historical data (eg: "2014-12-07").
		 * @return {Deferred.promise}     A promise to be resolved when the request is successfully received.
		 */
		/*
		var getCurrencyExchangeRateHistory = function(fromCurrency, toCurrency, startDate, endDate) {
			var deferred = $q.defer();

			var currencySymbol = toCurrency + '=X';
			var query = 'select * from yahoo.finance.historicaldata where symbol in ("' + currencySymbol + '") and startDate = "' + startDate + '" and endDate ="' + endDate + '"';
			var format = '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK';
			var url = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + format;

			$http.jsonp(url).success(function(json) {
				var data = [];

				if (json.query.count > 0) {
					// ...
				}

				deferred.resolved(data);
			});

			return deferred.promise;
		};
		*/


		/**
		 * Gets live, streaming currency exchange rates for the given symbol.
		 * @param  {string}  fromCurrency The currency to convert from (eg: "USD").
		 * @param  {string}  toCurrency   The currency to convert to (eg: "CAD").
		 * @param  {int}     interval     The refresh interval, in seconds (eg: 60).
		 * @param  {string}  period       The duration for which to get data, up to 10 days (eg: "1d", "1h", etc.).
		 * @return {Deferred.promise}     A promise to be resolved when the request is successfully received.
		 */
		var getCurrencyExchangeRateHistory = function(fromCurrency, toCurrency, interval, period) {
			var deferred = $q.defer();
			
			var maxTimestamp = 0;
			
			var googleFinanceURL = 'http://www.google.com/finance/getprices?q=' + fromCurrency + toCurrency + '&i=' + interval + '&p=' + period + '&f=d,c,v,k,o,h,l&df=cpct&auto=0&ei=Ef6XUYDfCqSTiAKEMg';
			var yqlQuery = 'SELECT * FROM csv WHERE url="' + googleFinanceURL + '"';
			var yqlURL = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(yqlQuery) + '&format=json&callback=JSON_CALLBACK';
			
			// Format of the Google Finance URL:
			//    http://www.google.com/finance/getprices?q=T&x=TSE&i=60&p=10d&f=d,c,v,k,o,h,l&df=cpct&auto=0&ei=Ef6XUYDfCqSTiAKEMg
			// Where:
			//    "q" is the stock symbol
			//    "x" is the stock exchange market
			//    "i" is the interval
			//    "p" is the period

			$http.jsonp(yqlURL).success(function(data) {
				var quotes = [];
				var now = new Date();
				
				var process = data.query.results !== null && data.query.results.row.length >= 7; // TODO: Some results do not have a "TIMEZONE_OFFSET=" line, parse data until "DATA=" line is found...
				if (data.query && data.query.count > 0 && process) {
					var timezoneOffset = 0;
					if (data.query.results.row[6]) {
						timezoneOffset = parseInt(data.query.results.row[6].col0.replace('TIMEZONE_OFFSET=', ''), 10); // in minutes
					}
					
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
							var close = parseFloat(data.query.results.row[i].col1, 10);
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
			getCurrencyExchangeRate: getCurrencyExchangeRate,
			getCurrencyExchangeRateHistory: getCurrencyExchangeRateHistory
		};
	}]);
