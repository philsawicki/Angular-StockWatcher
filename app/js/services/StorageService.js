'use strict';

/**
 * Local Storage Service.
 */
angular.module('stockWatcher.Services')
	.factory('storageService', ['$window', function ($window) {
		/**
		 * Saves the given value to storage.
		 * @param {string} key   The key uniquely identifying the value to store.
		 * @param {*}      value The value to save to storage.
		 */
		var setData = function (key, value) {
			var storage = $window.localStorage;
			if (storage) {
				storage.setItem(key, value);
			}
		};

		/**
		 * Retrieves the given value from storage, using its uniquely identifying key.
		 * @param  {string} key The key uniquerly identifying the value to retrieve.
		 * @return {*}          The value matching the given key, or "undefined" if nothing found 
		 *                      or if localStorage is not supported.
		 */
		var getData = function (key) {
			var storage = $window.localStorage;
			if (storage) {
				return storage.getItem(key);
			}
			return undefined;
		};

		/**
		 * Removes the given key/value association from storage.
		 * @param  {string} key The key uniquerly identifying the value to remove.
		 * @return {void}
		 */
		var deleteData = function (key) {
			var storage = $window.localStorage;
			if (storage) {
				storage.removeItem(key);
			}
		};

		/**
		 * Removes all data store in localStorage.
		 * @return {void}
		 */
		var deleteAllData = function () {
			var storage = $window.localStorage;
			if (storage) {
				storage.clear();
			}
		};

		return {
			setData: setData,
			getData: getData,
			deleteData: deleteData,
			deleteAllData: deleteAllData
		}
	}]);
