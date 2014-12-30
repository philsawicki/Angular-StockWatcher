'use strict';

/**
 * Unit Tests for Controllers.
 */

describe('HomePageController', function() {
	beforeEach(module('stockWatcher'));

	it('should display an introduction message with controller version', inject(function($controller) {
		var scope = {},
		    controller = $controller('HomePageController', {$scope:scope});

		expect(scope.controllerVersion).toBe('0.0.1');
	}));
});


describe('AboutPageController', function() {
	beforeEach(module('stockWatcher'));

	it('should display an introduction message with controller version', inject(function($controller) {
		var scope = {},
		    controller = $controller('AboutPageController', {$scope:scope});

		expect(scope.controllerVersion).toBe('0.0.1');
	}));
});




describe('StockListController', function() {
	var $httpBackend, $rootScope, createController;

	var constants = {
		DefaultJSONPRequest: 'http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20csv%20WHERE%20url%3D%22http%3A%2F%2Fwww.google.com%2Ffinance%2Fgetprices%3Fq%3DT%26x%3DTSE%26i%3D900%26p%3D1d%26f%3Dd%2Cc%2Cv%2Ck%2Co%2Ch%2Cl%26df%3Dcpct%26auto%3D0%26ei%3DEf6XUYDfCqSTiAKEMg%22&format=json&callback=JSON_CALLBACK'
	};



	// Set up the module:
	beforeEach(module('stockWatcher'));

	beforeEach(inject(function($injector) {
		// Set up the mock http service responses:
		$httpBackend = $injector.get('$httpBackend');
		$httpBackend.whenJSONP(constants.DefaultJSONPRequest)
			.respond(
				{} // TODO: Complete this with mock response data.
			);
		
		// Get hold of a scope (i.e. the root scope):
		$rootScope = $injector.get('$rootScope');
		
		// The $controller service is used to create instances of controllers:
		var $controller = $injector.get('$controller');

		createController = function() {
			return $controller('StockListController', {
				'$scope': $rootScope
			});
		};
	}));



	afterEach(function() {
		//$httpBackend.verifyNoOutstandingExpectation();
		//$httpBackend.verifyNoOutstandingRequest();
	});



	it('should have a default "Refresh Interval"', function() {
		var controller = createController();

		expect($rootScope.refreshInterval).toBeDefined();
		expect($rootScope.refreshInterval).toEqual(30);
	});

	it('should have a default "Sort Field"', function() {
		var controller = createController();

		expect($rootScope.sortOrder).toBeDefined();
		expect($rootScope.sortOrder).toBe('index');
	});

	it('should have a default "Sort Direction"', function() {
		var controller = createController();

		expect($rootScope.sortReversed).toBeDefined();
		expect($rootScope.sortReversed).toBe(false);
	});

	it('should have default Portfolio entries', function() {
		var controller = createController();

		expect($rootScope.stockQuotes).toBeDefined();
		expect($rootScope.stockQuotes.length).toBe(10);
	});

	//it('should fetch things', function() {
	//	$httpBackend.expectJSONP(constants.DefaultJSONPRequest);
	//
	//	var controller = createController();
	//	//$httpBackend.flush();
	//});
});
