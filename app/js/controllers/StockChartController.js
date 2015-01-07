'use strict';

/* Stock Chart Controller */
angular.module('stockWatcher.Controllers')
	.controller('StockChartController', ['$scope', '$interval', '$timeout', 'stockService', function($scope, $interval, $timeout, stockService) {
		// Set the default refresh interval for the table:
		$scope.refreshInterval = 60;
		
		// Set the ID of the <div> containing the chart (to be used by HighStocks library for drawing graph):
		var containerID = 'container' + $scope.symbol.replace('.', '');
		$scope.containerID = containerID;

		// "Open" price for the chart:
		$scope.yesterdayClosePrice = undefined;

		// "Chart" object to be used by HighStocks library for storing graph properties:
		$scope.chart = undefined;

		// Promise defined when "initGraph()" fails to receive data:
		$scope.initGraphPromise = undefined;

		// Promise defined when "updateGraph()" fails to receive data:
		$scope.updateGraphPromise = undefined;



		/**
		 * Fetches the "Previous Day's Close" price for the current stock.
		 * @return {void} Executes a promise that, when resolved, sets the "yesterdayClosePrice" for the current stock.
		 * @todo Add a timed "$interval" for this to be called regularly (i.e. at least at opening time each trade day).
		 */
		var fetchPreviousDayClosePrice = function() {
			var symbols = [$scope.symbol];

			var promise = stockService.getCurrentDataWithDetails(symbols);
			promise.then(function(data) {
				if (data.query.count > 0) {
					$scope.yesterdayClosePrice = data.query.results.row.PreviousClose;
					//console.log('PreviousClose for "' + $scope.symbol + '" [' + data.query.results.row.StockExchange + ']', yesterdayClosePrice);

					if (typeof $scope.yesterdayClosePrice !== 'undefined') {
						drawOpenPlotLine();
					}
				} else {
					//console.error('No PreviousClose for ' + $scope.symbol);
				}
			});
		};
		fetchPreviousDayClosePrice();


		/**
		 * Creates the "chart" object using the "Highcharts" library.
		 * @param  {Array} dataRows The initial dataset of values to plot on the chart.
		 * @return {void}
		 */
		var createGraph = function(dataRows) {
			$scope.chart = new Highcharts.StockChart({
				chart: {
					renderTo: containerID
				},
				title: {
					text: $scope.symbol + ' Stock Price'
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
					name: $scope.symbol,
					type: 'area',
					data: dataRows,
					gapSize: 5,
					tooltip: {
						valueDecimals: 2
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


			if (typeof $scope.yesterdayClosePrice !== 'undefined') {
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
			$scope.chart.showLoading();
		};
		$timeout(bootstrap, 0);





		var symbol = $scope.symbol.replace('.TO', '');
		var exchange = $scope.symbol.indexOf('TO') > -1 ? 'TSE' : 'NYSE';
		var interval = 60;
		var period = '10d';
		// Google Finance URL for this stock would be:
		// http://www.google.com/finance/getprices?q=T&x=TSE&i=60&p=10d&f=d,c,v,k,o,h,l&df=cpct&auto=0&ei=Ef6XUYDfCqSTiAKEMg
		
		var initGraph = function() {
			var promise = stockService.getLiveData(symbol, exchange, interval, period);
			promise.then(function(data) {
				if (data && data.length > 0) {
					// Hide the "Loading..." message overlayed on top of the chart:
					$scope.chart.hideLoading();

					// Recreate the chart with the new data:
					createGraph(data);
				} else {
					console.warn('"' + symbol + '" init did not receive data, refreshing it.');
					$scope.initGraphPromise = $timeout(initGraph, 1000);
				}
			});
		};
		//initGraph();

		/**
		 * Updates the chart with new data.
		 * @return {void}
		 */
		$scope.updateGraph = function() {
			var promise = stockService.getLiveData(symbol, exchange, interval, period);
			promise.then(function(data) {
				//console.log('Updating graph for "' + symbol + '"');
				
				if (data && data.length > 0) {
					setGraphData(data);
				} else {
					console.warn('"' + symbol + '" update did not receive data, refreshing it.');
					$scope.updateGraphPromise = $timeout($scope.updateGraph, 1000);
				}
			});
		}

		var setGraphData = function(data) {
			var stock = $scope.symbol;
			var serie = $scope.chart.series[0];
			serie.setData(data);
			
			if (typeof $scope.yesterdayClosePrice !== 'undefined') {
				drawOpenPlotLine();
			}
			
			$scope.chart.redraw();
		};
		

		var drawOpenPlotLine = function() {
			var stockSymbol = $scope.symbol;
			var previousClose = $scope.yesterdayClosePrice;

			if (typeof $scope.chart !== 'undefined') {
				//console.log('Drawing "Open" PlotLine for "%s" ($%s)', stockSymbol, previousClose);
				
				var openPlotLineID = stockSymbol + '-previousClose',
				    chartYAxis = $scope.chart.yAxis[0];
				
				chartYAxis.removePlotLine(openPlotLineID);
				chartYAxis.addPlotLine({
					color: 'red',
					dashStyle: 'LongDash',
					id: openPlotLineID,
					label: {
						text: 'Prev Close ($' + previousClose + ')'
					},
					width: 1,
					zIndex: 3,
					value: previousClose
				});
			}
		};
		

		
		
		$scope.createRefresher = function() {
			return $interval(function() {
				$scope.updateGraph();
			}, $scope.refreshInterval*1000);
		};

		$scope.createPreviousCloseRefresher = function() {
			return $interval(function() {
				fetchPreviousDayClosePrice();
			}, $scope.refreshInterval*1000);
		};
		
		$scope.destroyRefresher = function() {
			// Cancel "refresher":
			if (typeof $scope.refresher !== 'undefined') {
				$interval.cancel($scope.refresher);
				$scope.refresher = undefined;
			}

			// Cancel "previousCloseRefresher":
			if (typeof $scope.previousCloseRefresher !== 'undefined') {
				$interval.cancel($scope.previousCloseRefresher);
				$scope.previousCloseRefresher = undefined;
			}
		};
		
		$scope.refreshIntervalChanged = function() {
			$scope.destroyRefresher();
			$scope.createRefresher();
		};

		$scope.refresher = $scope.createRefresher();
		$scope.previousCloseRefresher = $scope.createPreviousCloseRefresher();

		
		/**
		 * Called on exit of the Controller, when it is destroyed.
		 * Opportunity to destroy the remaining resources and free up memory.
		 */
		$scope.$on('$destroy', function() {
			// Make sure that the "refresher" $interval is destroyed:
			$scope.destroyRefresher();


			// Destroy the "initGrap" $timeout Promise, if it is set:
			if (typeof $scope.initGraphPromise !== 'undefined') {
				$timeout.cancel($scope.initGraphPromise);
				$scope.initGraphPromise = undefined;
			}

			// Destroy the "updateGraph" $timeout Promise, if it is set:
			if (typeof $scope.updateGraphPromise !== 'undefined') {
				$timeout.cancel($scope.updateGraphPromise);
				$scope.updateGraphPromise = undefined;
			}


			// Removes the chart and purges memory:
			if (typeof $scope.chart !== 'undefined') {
				$scope.chart.destroy();
			}
        });
	}]);
