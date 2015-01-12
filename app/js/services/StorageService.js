'use strict';

/**
 * Local Storage Service.
 */
angular.module('stockWatcher.Services')
	.factory('storageService', ['$window', function ($window) {
		var setData = function(key, value) {
			if ($window.localStorage) {
				$window.localStorage.setItem(key, value);
			}
		};

		var getData = function(key) {
			if ($window.localStorage) {
				return $window.localStorage.getItem(key);
			}
			return null;
		};

		return {
			setData: setData,
			getData: getData
		}
	}]);
