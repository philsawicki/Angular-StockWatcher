describe('HomePageController', function() {
	beforeEach(module('myApp'));

	it('should display an introduction message with controller version', inject(function($controller) {
		var scope = {},
		    controller = $controller('HomePageController', {$scope:scope});

		expect(scope.controllerVersion).toBe('0.0.1');
	}));
});


describe('AboutPageController', function() {
	beforeEach(module('myApp'));

	it('should display an introduction message with controller version', inject(function($controller) {
		var scope = {},
		    controller = $controller('AboutPageController', {$scope:scope});

		expect(scope.controllerVersion).toBe('0.0.1');
	}));
});


/*
describe('StockListController', function() {
	beforeEach(module('myApp'));

	it('should display an introduction message with controller version', inject(function($controller) {
		var scope = {},
		    controller = $controller('StockListController', {$scope:scope});

		expect(scope.stockQuotes.length).toBe(10);
	}));
});
*/
