'use strict';


/* Unit Test for pages. */
describe('PageController', function () {
	var $rootScope = undefined;

	// Add a "toBeBoolean()" Jasmine matcher.
	// TODO: Move this to a custom include file, so it will be available everywhere.
	beforeEach(function () {
		jasmine.addMatchers({
			toBeBoolean: function (util, customEqualityTesters) {
				return {
					compare: function (actual, expected) {
						var result = {};
						result.pass = (typeof actual === 'boolean');

						if (result.pass) {
							result.message = '"' + actual + '" is boolean';
						} else {
							result.message = 'Expected "' + actual + '" to be boolean';
						}

						return result;
					}
				};
			}/*,
			toBeBetween: function (lower, higher) {
				return {
					compare: function (actual, lower, higher) {
						return {
							pass: (actual >= lower && actual <= higher),
							message: actual + ' is not between ' + lower + ' and ' + higher
						};
					}
				};
			}*/
		});
	});


	beforeEach(module('stockWatcher'));

	beforeEach(inject(function ($injector) {
		// Get hold of a scope (i.e. the root scope):
		$rootScope = $injector.get('$rootScope');
	}));


	it('should have an "Online Mode" set', function () {
		expect( $rootScope ).toBeDefined();

		expect( $rootScope.applicationIsOnline ).toBeDefined();
		expect( $rootScope.applicationIsOnline ).not.toBeNull();
		expect( $rootScope.applicationIsOnline ).toBeBoolean();
	});
});
