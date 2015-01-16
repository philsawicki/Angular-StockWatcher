'use strict';

/**
 * Sparkline Controller.
 */
angular.module('stockWatcher.Controllers')
	.controller('SparklineController', ['$scope', '$interval', 'stockService', 'errorMessages', 
		function ($scope, $interval, stockService, errorMessages) {

		// Set the default refresh interval for the table:
		$scope.refreshInterval = 60;

		// Flag to check if the data has been loaded:
		$scope.dataLoaded = false;

		var cssID = '#sparkline' + $scope.symbol.replace('.', '');


		var getStockData = function() {
			var symbol = $scope.symbol.replace('.TO', '');
			var exchange = $scope.symbol.indexOf('TO') > -1 ? 'TSE' : 'NYSE';
			var interval = 60;
			var period = '1d';

			var promise = stockService.getLiveData(symbol, exchange, interval, period);
			promise.then(
				function (data) {
					drawSparkline(data);
					$scope.dataLoaded = true;
				},
				function (reason) {
					if (reason) {
						var printError = true;

						if (typeof reason.error !== 'undefined') {
							if (reason.error === errorMessages.NoData.Error) {
								printError = false;
							}
						}

						if (printError) {
							console.error('Error while fetching data', reason);
						}
					}
				}
			);
		}
		$(document).ready(function() {
			getStockData();
		});






		function drawSparkline( data) {
			var width = $(cssID).parent().width();;
			var height = 24; //$('#sparkline' + $scope.symbol.replace('.', '')).parent().height();

			var x = d3.scale.linear().range([0, width - 2]);
			var y = d3.scale.linear().range([height - 4, 0]);

			var line = d3.svg.line()
				.interpolate('basis')
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.close); });



			data.forEach(function(d) {
				d.date = d[0];
				d.close = d[1];
			});
			x.domain(d3.extent(data, function(d) { return d.date; }));
			y.domain(d3.extent(data, function(d) { return d.close; }));

			var svg = d3.select(cssID)
				.select('svg')
				.remove();

			var circleColor = data[data.length-1].close > $scope.yesterdayClosePrice ?
				'green' : 'red';

			svg = d3.select(cssID)
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.append('g')
				.attr('transform', 'translate(0, 2)');
			svg.append('path')
				.datum(data)
				.attr('class', 'sparkline')
				.attr('d', line);
			svg.append('circle')
				.attr('class', 'sparkcircle ' + circleColor)
				.attr('cx', x(data[data.length-1].date))
				.attr('cy', y(data[data.length-1].close))
				.attr('r', 1.5);  
		}











		
		
		$scope.createRefresher = function() {
			return $interval(function() {
				getStockData();
			}, $scope.refreshInterval*1000);
		};
		
		$scope.destroyRefresher = function() {
			if (typeof refresher !== 'undefined') {
				$interval.cancel(refresher);
				refresher = undefined;
			}
		};
		
		$scope.refreshIntervalChanged = function() {
			$scope.destroyRefresher();
			$scope.createRefresher();
		};

		$scope.setRefreshInterval = function(interval) {
			$scope.refreshInterval = interval;
			$scope.refreshIntervalChanged();
		};
		
		var refresher = $scope.createRefresher();
		
		$scope.$on('$destroy', function() {
			// Make sure that the "refresher" $interval is destroyed:
			$scope.destroyRefresher();
        });
	}]);
