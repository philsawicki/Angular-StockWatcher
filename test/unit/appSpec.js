'use strict';

/**
 * Unit Tests for Stock Watcher App.
 */
describe('App', function () {
	var $window;
	
	
	// Set up the module:
	beforeEach(module('stockWatcher'));

	beforeEach(inject(function ($injector) {
		// Get hold of a scope (i.e. the root scope):
		$window = $injector.get('$window');
		
		if (!navigator.onLine) {
			navigator = navigator || {};
			navigator.onLine = navigator.onLine || function () {};
		}
		
		if (!$window.addEventListener) {
			$window.addEventListener = function () {};
		}
	}));
	

    describe('"String.format()" utility function', function () {
        it('should expose a "String.format()" utility if none defined', inject(function ($controller) {
            expect(String.prototype.format).toBeDefined();
        }));
		
		it('should format inputs', inject(function () {
            var output = 'test {0}'.format('value');

             expect(output).toEqual('test value');
        }));
		
		it('should not format missing inputs', inject(function () {
            var output = 'test {0} {1}'.format('value');

             expect(output).toEqual('test value {1}');
        }));
	});
});
