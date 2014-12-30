'use strict';

/* Stock Chart Controller */
angular.module('stockWatcher.Controllers')
	.controller('StockChartController', ['$scope', '$interval', 'stockService', function($scope, $interval, stockService) {
		// Set the default refresh interval for the table:
		$scope.refreshInterval = 60;
		
		// Set the ID of the <div> containing the chart (to be used by HighStocks library for drawing graph):
		var containerID = 'container' + $scope.symbol.replace('.', '');
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
		var fetchPreviousDayClosePrice = function() {
			var symbols = [$scope.symbol];

			var promise = stockService.getCurrentDataWithDetails(symbols);
			promise.then(function(data) {
				if (data.query.count > 0) {
					yesterdayClosePrice = data.query.results.row.PreviousClose;
					//console.log('PreviousClose for "' + $scope.symbol + '" [' + data.query.results.row.StockExchange + ']', yesterdayClosePrice);

					if (typeof yesterdayClosePrice !== 'undefined') {
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
			chart = new Highcharts.StockChart({
				chart: {
					renderTo: containerID
				},
				title: {
					text: $scope.symbol + ' Stock Price'
				},
				xAxis: {
					events: {
						setExtremes: function(event) {
							/*
							if (typeof(event.rangeSelectorButton) !== 'undefined') {
								var buttonCount = event.rangeSelectorButton.count;
								var buttonText = event.rangeSelectorButton.text;
								var buttonType = event.rangeSelectorButton.type;
								
								var selectedButtonIndex = undefined;
								for (var i = 0, nbButtons = this.chart.rangeSelector.buttons.length; i < nbButtons; i++) {
									if (this.chart.rangeSelector.buttons[i].state === 2) {
										selectedButtonIndex = i;
										break;
									}
								}
								
								var currentStock = this.chart.title.textStr.replace(' Stock Price', '');
								if (selectedButtonIndex < 3) { // Index of the button covering the range which is no longer "live" data.
									console.log('Live data!');
									
									_chartData[currentStock].maxTimestamp = 0; // Reset max timestamp
									_setGraphData([], options);
									
									_requestLiveData(_chartData[currentStock].options);
								} else {
									console.log('Historical data!');
									
									_requestHistoricalData(_chartData[currentStock].options, buttonCount, buttonType);
								}
							}
							*/
						}
					}
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


			if (typeof yesterdayClosePrice !== 'undefined') {
				drawOpenPlotLine();
			}
		};





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
					createGraph(data);
				} else {
					console.warn('"' + symbol + '" init did not receive data, refreshing it.');
					initGraph();
				}
			});
		};
		initGraph();

		/**
		 * Updates the chart with new data.
		 * @return {void}
		 */
		var updateGraph = function() {
			var promise = stockService.getLiveData(symbol, exchange, interval, period);
			promise.then(function(data) {
				//console.log('Updating graph for "' + symbol + '"');
				
				if (data && data.length > 0) {
					setGraphData(data);
				} else {
					console.warn('"' + symbol + '" update did not receive data, refreshing it.');
					updateGraph();
				}
			});
		}

		var setGraphData = function(data) {
			var stock = $scope.symbol;
			var serie = chart.series[0];
			serie.setData(data);
			
			if (typeof yesterdayClosePrice !== 'undefined') {
				drawOpenPlotLine();
			}
			
			chart.redraw();
		};
		

		var drawOpenPlotLine = function() {
			var stockSymbol = $scope.symbol;
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
        });
	}]);
