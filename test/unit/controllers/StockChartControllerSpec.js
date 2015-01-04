'use strict';

/**
 * Unit Tests for "StockChartController".
 */
describe('StockChartController', function() {
	var $rootScope, 
	    $scope,
	    $interval, 
	    $timeout, 
	    $httpBackend,
	    injector,
	    stockService, 
	    createController;

	var constants = {
		refreshInterval: 60,
		symbol: 'PG'
	};


	// Set up the module:
	beforeEach(module('stockWatcher'));

	beforeEach(inject(function($injector) {
		// Get hold of a scope (i.e. the root scope):
		$rootScope = $injector.get('$rootScope');
		$interval = $injector.get('$interval');
		$timeout = $injector.get('$timeout');
		$httpBackend = $injector.get('$httpBackend');
		injector = $injector;

		$httpBackend
			.when('JSONP', "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3DPG%26f%3Da0a2a5b0b2b3b4b6c0c1c3c4c6c8d0d1d2e0e1e7e8e9h0j0k0g0g1g3g4g5g6i0i5j0j1j3j4j5j6k0k1k2k4k5l0l1l2l3m0m2m3m4m5m6m7m8n0n4o0p0p1p2p5p6q0r0r1r2r5r6r7s0s1s6s7t1t7t8v0v1v7w0w1w4x0y0%26e%3D.csv'%20and%20columns%3D'Ask%2CAverageDailyVolume%2CAskSize%2CBid%2CAskRealTime%2CBidRealTime%2CBookValue%2CBidSize%2CChangeAndPercentChange%2CChange%2CCommission%2CCurrency%2CChangeRealTime%2CAfterHoursChangeRealTime%2CDividendPerShare%2CLastTradeDate%2CTradeDate%2CEarningsPerShare%2CErrorIndication%2CEPSEstimateCurrentYear%2CEPSEstimateNextYear%2CEPSEstimateNextQuarter%2CDaysHigh%2C_52WeekLow%2C_52WeekHigh%2CDaysLow%2CHoldingsGainPercent%2CAnnualizedGain%2CHoldingsGain%2CHoldingsGainPercentRealTime%2CHoldingsGainRealTime%2CMoreInfo%2COrderBookRealTime%2CYearLow%2CMarketCapitalization%2CMarketCapRealTime%2CEBITDA%2CChangeFrom52WeekLow%2CPercentChangeFrom52WeekLow%2CYearHigh%2CLastTradeRealTimeWithTime%2CChangePercentRealTime%2CChangeFrom52WeekHigh%2CPercentChangeFrom52WeekHigh%2CLastTradeWithTime%2CLastTradePriceOnly%2CHighLimit%2CLowLimit%2CDaysRange%2CDaysRangeRealTime%2C_50DayMovingAverage%2C_200DayMovingAverage%2CChangeFrom200DayMovingAverage%2CPercentChangeFrom200DayMovingAverage%2CChangeFrom50DayMovingAverage%2CPercentChangeFrom50DayMovingAverage%2CName%2CNotes%2COpen%2CPreviousClose%2CPricePaid%2CChangeInPercent%2CPricePerSales%2CPricePerBook%2CExDividendDate%2CPERatio%2CDividendPayDate%2CPERatioRealTime%2CPEGRatio%2CPricePerEPSEstimateCurrentYear%2CPricePerEPSEstimateNextYear%2CSymbol%2CSharesOwned%2CRevenue%2CShortRatio%2CLastTradeTime%2CTickerTrend%2C_1YearTargetPrice%2CVolume%2CHoldingsValue%2CHoldingsValueRealTime%2C_52WeekRange%2CDaysValueChange%2CDaysValueChangeRealTime%2CStockExchange%2CDividendYield'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
			.respond({});

		// Add pre-defined Controller values:
		$scope = $rootScope.$new();
		$scope.symbol = constants.symbol;

		// The $controller service is used to create instances of controllers:
		var $controller = $injector.get('$controller');

		createController = function() {
			return $controller('StockChartController', {
				'$scope': $scope,
				'$interval': $interval,
				'$timeout': $timeout
			});
		};
	}));



	it('should have a default "Refresh Interval"', function() {
		var controller = createController();

		expect($scope.refreshInterval).toBeDefined();
		expect($scope.refreshInterval).toEqual(constants.refreshInterval);
	});

	it('should have a Stock Symbol set', function() {
		var controller = createController();

		expect($scope.symbol).toBeDefined();
		expect($scope.symbol).toEqual(constants.symbol);
	});

	it('should have a "containerID" set', function() {
		var controller = createController();

		expect($scope.containerID).toBeDefined();
		expect($scope.containerID).toContain('container');
		expect($scope.containerID).toContain('PG');
	});

	it('should have an uninitialized Chart', function() {
		var controller = createController();

		expect($scope.chart).toBeUndefined();
	});

	it('should have a "Refresher" object set', function() {
		var controller = createController();

		expect($scope.refresher).toBeDefined();
	})

	xit('should have initiated the "Refresher"', function() {
		//var controller = createController();
		var flag;

		runs(function() {
			flag = false;

			var controller = injector.get('$controller')('StockChartController', {
					'$scope': $scope,
					'$interval': $interval,
					'$timeout': $timeout
				});

			$scope.refreshInterval = 1;

			spyOn($scope, 'createRefresher').andCallThrough();
			$scope.$apply();

			setTimeout(function() {
				flag = true;
			}, $scope.refreshInterval*1000 + 100 * 1);
		});

		waitsFor(function() {
			return flag;
		}, 'the flag to be set', ($scope.refreshInterval*1000 + 100 * 2));

		runs(function() {
			expect($scope.refresher).toBeDefined();

			$scope.refreshIntervalChanged();

			expect($scope.createRefresher).toBeDefined();
			expect($scope.createRefresher).toHaveBeenCalled();
		});
	});


	/**
	 * Unit Test events happening during modifications of the "Refresher".
	 */
	describe('"Refresher" modifications', function() {
		it('should call "create" and "destroy" methods upon "refresher" value changes', function() {
			var controller = createController();

			spyOn($scope, 'createRefresher').andCallThrough();
			spyOn($scope, 'destroyRefresher').andCallThrough();

			expect($scope.refresher).toBeDefined();

			$scope.refreshIntervalChanged();

			expect($scope.createRefresher).toHaveBeenCalled();
			expect($scope.destroyRefresher).toHaveBeenCalled();
		});

		it('should leave the "Refresher" undefined after calling "destroy"', function() {
			var controller = createController();

			expect($scope.refresher).toBeDefined();

			$scope.destroyRefresher();

			expect($scope.refresher).toBeUndefined();
		});

		xit('should create an $interval after calling "create"', function() {
			var controller = createController();

			spyOn($window, '$interval').andCallThrough();

			expect($scope.refresher).toBeDefined();

			$scope.createRefresher();

			//expect($window.$interval).toHaveBeenCalled();
			expect(window.$interval).toHaveBeenCalled();
		});

		it('should set the "Refresher" to undefined when calling "destroy"', function() {
			var controller = createController();

			spyOn($interval, 'cancel').andCallThrough();

			expect($scope.refresher).toBeDefined();
			var copyOfRefresherThatWasCalled = angular.copy($scope.refresher);

			$scope.destroyRefresher();

			expect($interval.cancel).toHaveBeenCalledWith(copyOfRefresherThatWasCalled);
			expect($scope.refresher).toBeUndefined();
		});

		xit('should run "updateGraph" after "refreshIntervalChanged"', function() {
			var flag = false;

			runs(function() {
				var controller = createController();

				spyOn($scope, 'refreshIntervalChanged').andCallThrough();
				spyOn($scope, 'updateGraph').andCallThrough();

				$scope.refreshInterval = 0;
				$scope.refreshIntervalChanged();

				setTimeout(function() {
					flag = true;
				}, 100);
			});

			waitsFor(function() {
				return flag;
			}, '"updateGraph" to be called', 200);

			runs(function() {
				expect($scope.refreshIntervalChanged).toHaveBeenCalled();
				expect($scope.updateGraph).toHaveBeenCalled();
			});
		});
	});

	
	/**
	 * Unit Test initial states of the "initGraph" and "updateGraph" Promises.
	 */
	describe('Initial Chart Promises states', function() {
		it('should not have a pending "initGraph" Promise', function() {
			var controller = createController();

			expect($scope.initGraphPromise).toBeUndefined();
		});

		it('should not have a pending "updateGraph" Promise', function() {
			var controller = createController();

			expect($scope.updateGraphPromise).toBeUndefined();
		});
	});


	/**
	 * Unit Test events happening when "$scope.$destroy()" is called.
	 */
	describe('Destroy events', function() {
		it('should destroy the "Refresher"', function() {
			var controller = createController();

			spyOn($scope, 'destroyRefresher').andCallThrough();

			$scope.$destroy();

			expect($scope.destroyRefresher).toHaveBeenCalled();
		});

		it('should destroy the Chart', function() {
			var controller = createController();

			// Workaround since "$scope.chart" is not yet initialized:
			expect($scope.chart).toBeUndefined();
			$scope.chart = { destroy: function() {} };

			spyOn($scope.chart, 'destroy').andCallThrough();

			$scope.$destroy();

			expect($scope.chart.destroy).toHaveBeenCalled();
		});

		describe('Chart Promises states', function() {
			xit('should cancel the "initGraph" Promise', function() {
				var controller = createController();

				spyOn($timeout, 'cancel').andCallThrough();

				$scope.$destroy();

				expect($timeout.cancel).toHaveBeenCalled();
			});

			it('should restore the "initGraph" Promise to its original state', function() {
				var controller = createController();

				expect($scope.initGraphPromise).toBeUndefined();

				$scope.initGraphPromise = {};

				expect($scope.initGraphPromise).toBeDefined();

				$scope.$destroy();

				expect($scope.initGraphPromise).toBeUndefined();
			});

			it('should restore the "updateGraph" Promise to its original state', function() {
				var controller = createController();

				expect($scope.updateGraphPromise).toBeUndefined();

				$scope.updateGraphPromise = {};

				expect($scope.updateGraphPromise).toBeDefined();

				$scope.$destroy();

				expect($scope.updateGraphPromise).toBeUndefined();
			});
		});
	});
});
