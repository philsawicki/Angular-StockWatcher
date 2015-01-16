'use strict';

/**
 * Market Chart Controller
 */
angular.module('stockWatcher.Controllers')
	.controller('MarketChartController', ['$scope', '$interval', 'stockService', 'errorMessages', 
		function ($scope, $interval, stockService, errorMessages) {

		// Set the default refresh interval for the table:
		$scope.refreshInterval = 60;

		// Set the default status for the chart initialization flag:
		$scope.chartIsInitialized = false;
		
		// Set the ID of the <div> containing the chart (to be used by HighStocks library for drawing graph):
		var containerID = 'container' + 'Markets';
		$scope.containerID = containerID;

		// "Open" price for the chart:
		var yesterdayClosePrice = undefined;

		// "Chart" object to be used by HighStocks library for storing graph properties:
		var chart = undefined;

		// List of Indices to draw on the chart, and their associated data:
		var marketData = [
			{
				symbol: '.INX',
				name: 'S&P 500', // 'S&P 500 Index'
				data: []
			},
			{
				symbol: '.DJI',
				name: 'Dow Jones', // 'Dow Jones Industrial Average'
				data: []
			},
			{
				symbol: 'OSPTX',
				name: 'S&P/TSX', // 'S&P/TSX Composite Index'
				data: []
			}
		];

		// Data fetch Promises (for init & update):
		var fetchPromises = [];

		var chartOptions = {
			title: 'TSX, Dow Jones & S&P500 Indices'
		};



		/**
		 * Fetches the "Previous Day's Close" price for the current stock.
		 * @return {void} Executes a promise that, when resolved, sets the "yesterdayClosePrice" for the current stock.
		 * @todo Add a timed "$interval" for this to be called regularly (i.e. at least at opening time each trade day).
		 */
		var fetchPreviousDayClosePrice = function() {
			var symbols = [$scope.symbol];

			var promise = stockService.getCurrentDataWithDetails(symbols);
			promise.then(
				function (data) {
					if (data.query.count > 0) {
						yesterdayClosePrice = data.query.results.row.PreviousClose;

						if (typeof yesterdayClosePrice !== 'undefined') {
							drawYesterdayClosePlotLine();
						}
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
					text: chartOptions.title
				},
				credits: {
					enabled: false
				},
				//navigator: {
				//	enabled: false
				//},
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
				series: marketData,
				plotOptions: {
					series: {
						compare: 'percent'
					}
				},
				yAxis: {
					labels: {
						formatter: function() {
							return (this.value > 0 ? ' + ' : '') + this.value + '%';
						}
					},
					plotLines: [{
						value: 0,
						width: 2,
						color: 'silver'
					}]
				},
				tooltip: {
					pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
					valueDecimals: 2
				}
			});


			if (typeof yesterdayClosePrice !== 'undefined') {
				drawYesterdayClosePlotLine();
			}

			// Chart is now initialized, update flag:
			$scope.chartIsInitialized = true;
		};




		var interval = 60;
		var period = '10d';
		var seriesCount = 0;

		/**
		 * Updates the fetch Promise for the given data.
		 * @param  {int}    stockIndex The index of the stock data in the "marketData" Object array.
		 * @param  {string} fetchType  Type of callback to execute once data is received (either "init" or "update").
		 * @return {void}
		 */
		var updateFetchPromise = function(stockIndex, fetchType) {
			var marketSymbol = marketData[stockIndex].symbol;
			var nbMarketSymbols = marketData.length;

			fetchPromises[stockIndex] = stockService.getLiveMarketData(marketSymbol, interval, period);
			fetchPromises[stockIndex].then(
				// Must wrap the Promise callback into a closure in order to pass the serie's index:
				(function (index, fetchType) {
					return function (data) {
						// If data is received, store it to be drawn later:
						if (data && data.length > 0) {

							if (fetchType === 'init') {
								// Set data for the stock symbol:
								marketData[index].data = data;

								seriesCount++;
								if (seriesCount === nbMarketSymbols) {
									// Received all Market data, graph is now ready to be drawn:
									createGraph();
								}
							} else if (fetchType === 'update') {
								setGraphData(index, data);
							}
						} else {
							// No data was received, try fetching it once again:
							updateFetchPromise(index, fetchType);
						}
					};
				})(stockIndex, fetchType), 

				// Must wrap the Promise callback into a closure in order to pass the serie's index:
				(function (index, fetchType) {
					return function (reason) {
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

						// Retry fetching the data for the given serie:
						updateFetchPromise(index, fetchType);
					};
				})(stockIndex, fetchType)
			);
		};

		/**
		 * Fetches the initial data required to draw the chart.
		 * @return {void}
		 */
		var initGraph = function() {
			for (var i = 0, nbMarketSymbols = marketData.length; i < nbMarketSymbols; i++) {
				updateFetchPromise(i, 'init');
			}
		};
		initGraph();

		/**
		 * Updates the chart with new data.
		 * @return {void}
		 */
		var updateGraph = function() {
			// Chart might not be created yet when "updateGraph()" is called by the "refresher" $interval.
			// Early exit in this case, as to not make requests too early or cause potential crashes when referencing "chart".
			if (typeof chart !== 'undefined') {
				for (var i = 0, nbMarketSymbols = marketData.length; i < nbMarketSymbols; i++) {
					updateFetchPromise(i, 'update');
				}
			}
		};

		/**
		 * Sets the chart's data for the given serie index.
		 * @param {int}   serieIndex The index of the serie to update.
		 * @param {Array} data       The data to set.
		 */
		var setGraphData = function(serieIndex, data) {
			var serie = chart.series[serieIndex];
			serie.setData( marketData[serieIndex].data );
			
			if (typeof yesterdayClosePrice !== 'undefined') {
				drawYesterdayClosePlotLine();
			}
		};

		/**
		 * Draws a horizontal trendline on the chart, indicating yesterday's close price.
		 * @return {void}
		 */
		var drawYesterdayClosePlotLine = function() {
			var stockSymbol = $scope.fromCurrency + $scope.toCurrency;
			var open = yesterdayClosePrice;

			if (chart) {
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
		
		$scope.destroyRefresher = function() {
			if (angular.isDefined(refresher)) {
				$interval.cancel(refresher);
				refresher = undefined;
			}
		};
		
		$scope.refreshIntervalChanged = function() {
			$scope.destroyRefresher();
			$scope.createRefresher();
		};
		
		var refresher = $scope.createRefresher();
		
		$scope.$on('$destroy', function() {
			// Make sure that the "refresher" $interval is destroyed:
			$scope.destroyRefresher();

			// Removes the chart and purges memory:
			if (typeof chart !== 'undefined') {
				chart.destroy();
			}
		});






		/**
		 * Listen for "showTitle" variable changes in $parent's $scope and make 
		 * changes accordingly.
		 */
		$scope.$parent.$watch('showTitle', function (showTitle) {
			if (typeof chart !== 'undefined') {
				if (showTitle) {
					chart.setTitle({ text: chartOptions.title });
				} else {
					chart.setTitle({ text: null });
				}

				chart.reflow();
				chart.redraw();
			}
		});

		/**
		 * Listen for "showZoom" variable changes in $parent's $scope and make 
		 * changes accordingly.
		 */
		$scope.$parent.$watch('showZoom', function (newValue) {
			if (typeof chart !== 'undefined') {
				chart.rangeSelector.enabled = newValue;

				chart.reflow();
				chart.redraw();
			}
		});

		/**
		 * Listen for "showDatePicker" variable changes in $parent's $scope and make 
		 * changes accordingly.
		 */
		$scope.$parent.$watch('showDatePicker', function (newValue) {
		});

		/**
		 * Listen for "showNavigator" variable changes in $parent's $scope and make 
		 * changes accordingly.
		 */
		$scope.$parent.$watch('showNavigator', function (showNavigator) {
			if (typeof chart !== 'undefined') {
				var scroller = chart.scroller;

				if (showNavigator) {
					scroller.xAxis.labelGroup.show();
					scroller.xAxis.gridGroup.show();
					scroller.series.show();
					scroller.navigatorGroup.show();
					scroller.scrollbar.show();
					scroller.scrollbarRifles.show();
					scroller.scrollbarGroup.show();

					//for (var i = 0, nbElementsToDestroy = scroller.elementsToDestroy; i < nbElementsToDestroy; i++) {
					//	scroller.elementsToDestroy[i].show();
					//}
					$.each(scroller.elementsToDestroy, function (i, elem) {
						elem.hide();
					});
				} else {
					scroller.xAxis.labelGroup.hide();
					scroller.xAxis.gridGroup.hide();
					scroller.series.hide();
					scroller.scrollbar.hide();
					scroller.scrollbarGroup.hide();
					scroller.scrollbarRifles.hide();
					scroller.navigatorGroup.hide();

					//for (var i = 0, nbElementsToDestroy = scroller.elementsToDestroy; i < nbElementsToDestroy; i++) {
					//	scroller.elementsToDestroy[i].hide();
					//}
					$.each(scroller.elementsToDestroy, function (i, elem) {
						elem.hide();
					});
				}

				chart.reflow();
				chart.redraw();
			}
		});
	}]);
