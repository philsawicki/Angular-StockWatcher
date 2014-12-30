'use strict';

/* Home Page Controller */
angular.module('stockWatcher.Controllers')
	.controller('HomePageController', ['$scope', 'currencyService', function($scope, currencyService) {
		$scope.controllerVersion = '0.0.1';

		var testCurrencyExchangeRate = function() {
			var promise = currencyService.getCurrencyExchangeRate('USD', 'CAD');
			promise.then(function(data) {
				console.log('USD to CAD:', data);
			});
		};
		testCurrencyExchangeRate();
	}]);
