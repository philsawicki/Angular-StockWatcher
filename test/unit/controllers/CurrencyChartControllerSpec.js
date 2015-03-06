'use strict';

/**
 * Unit Tests for "CurrencyChartController".
 */
describe('CurrencyChartController', function () {
	var $rootScope, 
	    $scope,
	    $interval, 
	    $timeout, 
	    stockService, 
	    createController,
	    controller;

	var constants = {
		fromCurrency: 'USD',
		toCurrency: 'CAD'
	};


	// Set up the module:
	beforeEach(module('stockWatcher'));

	beforeEach(inject(function ($injector) {
		// Get hold of a scope (i.e. the root scope):
		$rootScope = $injector.get('$rootScope');
		$interval = $injector.get('$interval');
		$timeout = $injector.get('$timeout');

		// Add pre-defined Controller values:
		$scope = $rootScope.$new();
		$scope.fromCurrency = constants.fromCurrency;
		$scope.toCurrency = constants.toCurrency;

		// The $controller service is used to create instances of controllers:
		var $controller = $injector.get('$controller');

		createController = function () {
			return $controller('CurrencyChartController', {
				'$scope': $scope,
				'$interval': $interval,
				'$timeout': $timeout
			});
		};

		// Initialize Controller for system under test:
		controller = createController();
	}));



	it('should have a default "Refresh Interval"', function () {
		expect($scope.refreshInterval).toBeDefined();
		expect($scope.refreshInterval).toEqual(60);
	});

	it('should have a "From" currency set', function () {
		expect($scope.fromCurrency).toBeDefined();
		expect($scope.fromCurrency).toEqual(constants.fromCurrency);
	});

	it('should have a "To" currency set', function () {
		expect($scope.toCurrency).toBeDefined();
		expect($scope.toCurrency).toEqual(constants.toCurrency);
	});

	it('should have a "containerID" set', function () {
		expect($scope.containerID).toBeDefined();
		expect($scope.containerID).toContain('container');
		expect($scope.containerID).toContain($scope.fromCurrency);
		expect($scope.containerID).toContain($scope.toCurrency);
	});

	describe('Initial Chart Promises states', function () {
		it('should not have a pending "initGraph" Promise', function () {
			expect($scope.initGraphPromise).toBeUndefined();
		});

		it('should not have a pending "updateGraph" Promise', function () {
			expect($scope.updateGraphPromise).toBeUndefined();
		});
	});
	
	describe('$scope destruction', function () {
		it('should call the "destroyRefreshed" method', function () {
			spyOn($scope, 'destroyRefresher').andCallThrough();
			
			$scope.$destroy();
			
			expect($scope.destroyRefresher).toHaveBeenCalled();
			expect($scope.refresher).toBeUndefined();
		});
	});
	
	describe('$interval change', function () {
		it('should destroy then create a new Refresher', function () {
			spyOn($scope, 'destroyRefresher').andCallThrough();
			spyOn($scope, 'createRefresher').andCallThrough();
			
			$scope.refreshIntervalChanged();
			
			expect($scope.destroyRefresher).toHaveBeenCalled();
			expect($scope.createRefresher).toHaveBeenCalled();
		});
	});
});
