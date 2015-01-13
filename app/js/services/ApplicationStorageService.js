'use strict';

/**
 * Application Storage Service.
 */
angular.module('stockWatcher.Services')
	.factory('applicationStorageService', ['$window', 'appConfig', 'storageService', 
		function ($window, appConfig, storageService) {

		/**
		 * Cache to bypass I/O access to storage.
		 * @type {Object}
		 */
		var _cache = {};


		/**
		 * Gets data from cache.
		 * @param  {string} key The key uniquely identifying the data to retrieve from cache.
		 * @return {*}          The cached data (or "undefined" if nothing found).
		 */
		var _getFromCache = function(key) {
			return _cache[key];
		};

		/**
		 * Saves data to cache.
		 * @param {string} key   The key uniquely identifying the data to save to cache.
		 * @param {*}      value The data to save to cache.
		 */
		var _setCache = function(key, value) {
			_cache[key] = value;
		};


		/**
		 * Gets saved stock symbols.
		 * @return {Array<Object>} The list of saved stock symbols.
		 */
		var getSavedStockSymbols = function() {
			var key = appConfig.StorageKeys.StoredQuotes;

			// Try to retrieve data from cache:
			var cachedData = _getFromCache(key);
			if (cachedData) {
				return cachedData;
			}

			var savedStocks = angular.fromJson(storageService.getData(key));
			return savedStocks;
		};

		/**
		 * Saves the given stock symbols.
		 * @param {Array<Object>} stockSymbols The list of stock symbols to save.
		 */
		var setSavedStocks = function(stockSymbols) {
			var key = appConfig.StorageKeys.StoredQuotes;

			// Save the data to cache:
			_setCache(key, stockSymbols);

			var dataToSave = angular.toJson(stockSymbols);
			storageService.setData(key, dataToSave);
		};

		return {
			getSavedStockSymbols: getSavedStockSymbols,
			setSavedStocks: setSavedStocks
		}
	}]);
