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
		var getCurrencyExchangeRateHistory = function(fromCurrency, toCurrency, startDate, endDate) {
			var deferred = $q.defer();

			var query = '';
			var format = '';
			var url = '';

			$http.jsonp(url).success(function(json) {
				var data = [];

				if (json.query.count > 0) {
					// ...
				}

				deferred.resolved(data);
			});

			return deferred.promise;
		};

		return {
			getCurrencyExchangeRate: getCurrencyExchangeRate,
			getCurrencyExchangeRateHistory: getCurrencyExchangeRateHistory
		};
	}]);
