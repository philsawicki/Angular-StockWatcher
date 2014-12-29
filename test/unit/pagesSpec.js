'use strict';

/* Unit Test for pages. */

describe('PageController', function() {
	var rootScope = undefined;

	// Add a "toBeBoolean()" Jasmine matcher.
	// TODO: Move this to a custom include file, so it will be available everywhere.
	beforeEach(function() {
		this.addMatchers({
			toBeBoolean: function() {
				return {
					compare: function(actual, expected) {
						return {
							pass: (typeof expected === 'boolean'),
							message: 'Expected ' + actual + ' is not boolean'
						};
					}
				};
			},
			toBeBetween: function(lower, higher) {
				return {
					compare: function(actual, lower, higher) {
						return {
							pass: (actual >= lower && actual <= higher),
							message: actual + ' is not between ' + lower + ' and ' + higher
						};
					}
				};
			}
		});
	});

	beforeEach(module('myApp'));

	beforeEach(function() {
		// Inject $rootScope:
		inject(function($rootScope) {
			// Create a new child scope and call it "rootScope":
			// rootScope = $rootScope.$new();
			// Instead don't create a child scope and keep a reference to the actual rootScope:
			rootScope = $rootScope;
		});
	});


	it('should have an "Online Mode" set', function() {
		expect(rootScope).toBeDefined();

		expect(rootScope.applicationIsOnline).toBeDefined();
		//expect(rootScope.applicationIsOnline).toMatch(/true|false/);
		//expect(typeof rootScope.applicationIsOnline).toBe('boolean');
		expect(rootScope.applicationIsOnline).toBeBoolean();
	});
});
