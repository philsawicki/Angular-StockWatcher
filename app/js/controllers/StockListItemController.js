'use strict';

/* Stock List Item Controller */
angular.module('myApp.StockListItemController', [])
	.controller('StockListItemController', ['$scope', 'stockService', function($scope, stockService) {
		
		var stockQuotes = [
			{
				symbol: 'T',
				exchange: 'TSE',
				interval: 60*15,
				period: '1d'
			}
		];
		
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
	}]);