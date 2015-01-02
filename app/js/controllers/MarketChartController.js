'use strict';

/* Market Chart Controller */
angular.module('stockWatcher.Controllers')
	.controller('MarketChartController', ['$scope', '$interval', 'stockService', function ($scope, $interval, stockService) {
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
		//fetchPreviousDayClosePrice();


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
				series: marketData,
				/*[{
					name: marketData[0].name,
					//type: 'area',
					data: marketData[0].data,
					//gapSize: 5,
					//tooltip: {
					//	valueDecimals: 4
					//},
					//fillColor: {
					//	linearGradient: {
					//		x1: 0,
					//		y1: 0,
					//		x2: 0,
					//		y2: 1
					//	},
					//	stops: [
					//		[0, Highcharts.getOptions().colors[0]],
					//		[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
					//	]
					//},
					threshold: null
				},
				{
					name: marketData[1].name,
					//type: 'area',
					data: marketData[1].data,
					//gapSize: 5,
					//tooltip: {
					//	valueDecimals: 4
					//},
					//fillColor: {
					//	linearGradient: {
					//		x1: 0,
					//		y1: 0,
					//		x2: 0,
					//		y2: 1
					//	},
					//	stops: [
					//		[0, Highcharts.getOptions().colors[0]],
					//		[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
					//	]
					//},
					threshold: null
				},
				{
					name: marketData[2].name,
					//type: 'area',
					data: marketData[2].data,
					//gapSize: 5,
					//tooltip: {
					//	valueDecimals: 4
					//},
					//fillColor: {
					//	linearGradient: {
					//		x1: 0,
					//		y1: 0,
					//		x2: 0,
					//		y2: 1
					//	},
					//	stops: [
					//		[0, Highcharts.getOptions().colors[0]],
					//		[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
					//	]
					//},
					threshold: null
				}],
				*/
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
				drawOpenPlotLine();
			}

			// Chart is now initialized, update flag:
			$scope.chartIsInitialized = true;
		};




		//var marketSymbol = marketSymbols[1].symbol;
		var interval = 60;
		var period = '10d';
		// Google Finance URL for this stock would be:
		// http://www.google.com/finance/getprices?q=T&x=TSE&i=60&p=10d&f=d,c,v,k,o,h,l&df=cpct&auto=0&ei=Ef6XUYDfCqSTiAKEMg

		var seriesCount = 0;
		var initGraph = function() {
			for (var i = 0, nbMarketSymbols = marketData.length; i < nbMarketSymbols; i++) {
				var marketSymbol = marketData[i].symbol;

				var promise = stockService.getLiveMarketData(marketSymbol, interval, period);
				promise.then(
					// Must wrap the Promise callback into a closure in order to pass the serie's index:
					(function (index) {
						return function (data) {
							if (data && data.length > 0) {
								console.log('MarketChartController::initGraph() received data for index #' + index + ': "' + marketData[index].name + '"');
								marketData[index].data = data;

								seriesCount++;
								if (seriesCount === nbMarketSymbols) {
									console.log('MarketChartController::initGraph() received all expected data. Creating graph...');
									// Received all Market data, graph is now ready to be drawn:
									createGraph();
								}
							}
						};
					})(i)
				);
			}
		};
		initGraph();

		/**
		 * Updates the chart with new data.
		 * @return {void}
		 */
		var updateGraph = function() {
			for (var i = 0, nbMarketSymbols = marketData.length; i < nbMarketSymbols; i++) {
				var marketSymbol = marketData[i].symbol;

				var promise = stockService.getLiveMarketData(marketSymbol, interval, period);
				promise.then(
					// Must wrap the Promise callback into a closure in order to pass the serie's index:
					(function (index) {
						return function (data) {
							//console.log('Updating graph for "' + symbol + '"');
							
							if (data && data.length > 0) {
								console.log('MarketChartController::updateGraph() received data for index #' + index + ': "' + marketData[index].name + '"');
								setGraphData(i, data);
							} else {
								console.warn('"' + marketData[index].name + '" update did not receive data, refreshing it.');
								updateGraph();
							}
						};
					})(i)
				);
			}
		}

		var setGraphData = function(serieIndex, data) {
			//var stock = $scope.symbol;
			var serie = chart.series[serieIndex];
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
