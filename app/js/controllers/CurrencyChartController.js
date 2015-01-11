'use strict';

/**
 * Currency Chart Controller
 */
angular.module('stockWatcher.Controllers')
	.controller('CurrencyChartController', ['$scope', '$interval', '$timeout', 'currencyService', 'errorMessages', 
		function ($scope, $interval, $timeout, currencyService, errorMessages) {

		// Set the default refresh interval for the table:
		$scope.refreshInterval = 60;
		
		// Set the ID of the <div> containing the chart (to be used by HighStocks library for drawing graph):
		var containerID = 'container' + $scope.fromCurrency + $scope.toCurrency;
		$scope.containerID = containerID;

		// "Open" price for the chart:
		var yesterdayClosePrice = undefined;

		// "Chart" object to be used by HighStocks library for storing graph properties:
		var chart = undefined;



		/**
		 * Fetches the "Previous Day's Close" price for the current stock.
		 * @return {void} Executes a promise that, when resolved, sets the "yesterdayClosePrice" for the current stock.
		 * @todo Add a timed "$interval" for this to be called regularly (i.e. at least at opening time each trade day).
		 */
		$scope.fetchPreviousDayClosePrice = function() {
			var symbols = [$scope.symbol];

			var promise = stockService.getCurrentDataWithDetails(symbols);
			promise.then(
				function (data) {
					if (data.query.count > 0) {
						yesterdayClosePrice = data.query.results.row.PreviousClose;
						
						if (typeof yesterdayClosePrice !== 'undefined') {
							drawOpenPlotLine();
						}
					}
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
		};
		//$scope.fetchPreviousDayClosePrice();


		/**
		 * Creates the "chart" object using the "Highcharts" library.
		 * @param  {Array} dataRows The initial dataset of values to plot on the chart.
		 * @return {void}
		 */
		var createGraph = function(dataRows) {
			chart = new Highcharts.StockChart({
				chart: {
					renderTo: containerID
				},
				title: {
					text: $scope.fromCurrency + ' to ' + $scope.toCurrency
				},
				credits: {
					enabled: false
				},
				rangeSelector: {
					buttons: [{
						type: 'day',
						count: 1,
						text: '1d'
					},{
						type: 'day',
						count: 2,
						text: '2d'
					},{
						type: 'day',
						count: 7,
						text: '5d'
					},
					/*{
						type: 'month',
						count: 1,
						text: '1m'
					}, {
						type: 'month',
						count: 3,
						text: '3m'
					}, {
						type: 'month',
						count: 6,
						text: '6m'
					}, {
						type: 'ytd',
						text: 'YTD'
					}, */{
						type: 'all',
						text: 'All'
					}],
					selected: 0,
					allButtonsEnabled: true
				},
				series: [{
					name: $scope.fromCurrency + ' to ' + $scope.toCurrency,
					type: 'area',
					data: dataRows,
					gapSize: 5,
					tooltip: {
						valueDecimals: 4
					},
					fillColor: {
						linearGradient: {
							x1: 0,
							y1: 0,
							x2: 0,
							y2: 1
						},
						stops: [
							[0, Highcharts.getOptions().colors[0]],
							[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
						]
					},
					threshold: null
				}]
			});


			if (typeof yesterdayClosePrice !== 'undefined') {
				drawOpenPlotLine();
			}
		};



		/**
		 * Kick off the initialization of the chart and the loading of the initil data.
		 */
		var bootstrap = function() {
			// Kick off the request for data to fill the chart and remove the 
			// "Loading..." message (hopefully the chart will have been created once
			// the data is received):
			initGraph();

			// Create the graph a first time, with empty data:
			createGraph([null]);
			// Show a "Loading..." message overlayed on top of the chart:
			chart.showLoading();
		};
		$timeout(bootstrap, 0);



		var fromCurrency = $scope.fromCurrency;
		var toCurrency = $scope.toCurrency;
		var interval = 60*3; // Must be at least 60*3 over a '10d'-period, otherwise the CSV will have more than 5000 lines, which YQL will clip.
		var period = '10d';
		
		var initGraph = function() {
			var promise = currencyService.getCurrencyExchangeRateHistory(fromCurrency, toCurrency, interval, period);
			promise.then(
				function (data) {
					if (data && data.length > 0) {
						// Hide the "Loading..." message overlayed on top of the chart:
						chart.hideLoading();

						// Recreate the chart with the new data:
						createGraph(data);
					} else {
						console.warn('"' + fromCurrency + '-' + toCurrency + '" init did not receive data, refreshing it.');
						initGraph();
					}
				},

				function (reason) {
					if (reason) {
						if (console && console.error) {
							console.error(reason);
						}
					}
				}
			);
		};
		//initGraph();

		/**
		 * Updates the chart with new data.
		 * @return {void}
		 */
		var updateGraph = function() {
			var promise = currencyService.getCurrencyExchangeRateHistory(fromCurrency, toCurrency, interval, period);
			promise.then(
				function (data) {
					//console.log('Updating graph for "' + symbol + '"');
					
					if (data && data.length > 0) {
						setGraphData(data);
					} else {
						console.warn('"' + fromCurrency + '-' + toCurrency + '" update did not receive data, refreshing it.');
						updateGraph();
					}
				},

				function (reason) {
					if (reason) {
						if (console && console.error) {
							console.error(reason);
						}
					}
				}
			);
		}

		var setGraphData = function(data) {
			//var stock = $scope.symbol;
			var serie = chart.series[0];
			serie.setData(data);
			
			if (typeof yesterdayClosePrice !== 'undefined') {
				drawOpenPlotLine();
			}
			
			chart.redraw();
		};
		

		var drawOpenPlotLine = function() {
			var stockSymbol = $scope.fromCurrency + $scope.toCurrency;
			var open = yesterdayClosePrice;

			if (chart) {
				//console.log('Drawing "Open" PlotLine for "%s" ($%s)', stockSymbol, open);
				
				var openPlotLineID = stockSymbol + '-open',
				    chartYAxis = chart.yAxis[0];
				
				chartYAxis.removePlotLine(openPlotLineID);
				chartYAxis.addPlotLine({
					color: 'red',
					dashStyle: 'LongDash',
					id: openPlotLineID,
					label: {
						text: 'Prev Close ($' + open + ')'
					},
					width: 1,
					zIndex: 3,
					value: open
				});
			}
		};
		

		
		
		$scope.createRefresher = function() {
			return $interval(function() {
				updateGraph();
			}, $scope.refreshInterval*1000);
		};

		//$scope.createPreviousCloseRefresher = function() {
		//	return $interval(function() {
		//		fetchPreviousDayClosePrice();
		//	}, $scope.refreshInterval*1000);
		//};
		
		$scope.destroyRefresher = function() {
			// Cancel "refresher":
			if (typeof $scope.refresher !== 'undefined') {
				$interval.cancel($scope.refresher);
				$scope.refresher = undefined;
			}

			// Cancel "previousCloseRefresher":
			//if (typeof $scope.previousCloseRefresher !== 'undefined') {
			//	$interval.cancel($scope.previousCloseRefresher);
			//	$scope.previousCloseRefresher = undefined;
			//}
		};
		
		$scope.refreshIntervalChanged = function() {
			$scope.destroyRefresher();
			$scope.createRefresher();
		};

		$scope.refresher = $scope.createRefresher();
		//$scope.previousCloseRefresher = $scope.createPreviousCloseRefresher();


		/**
		 * Called on exit of the Controller, when it is destroyed.
		 * Opportunity to destroy the remaining resources and free up memory.
		 */
		$scope.$on('$destroy', function() {
			// Make sure that the "refresher" $interval is destroyed:
			$scope.destroyRefresher();

			// Removes the chart and purges memory:
			if (typeof chart !== 'undefined') {
				chart.destroy();
			}
        });
	}]);
