'use strict';

/**
 * Unit Tests for "ReverseFilter".
 */
describe('Reverse Filter', function () {
    var $filter = undefined,
        reverseFilter = undefined;


    // Set up the module:
    beforeEach(module('stockWatcher'));

    beforeEach(inject(function ($injector) {
        // Get objects to test:
        $filter = $injector.get('$filter');
        reverseFilter = $filter('reverse');
    }));


    it('reverses the given array', function () {
        var filterOutput = reverseFilter([1, 2, 3]);
		
        expect( filterOutput ).toEqual( [3, 2, 1] );
    });

    it('does not change the input object if it is not an array but an Object', function () {
        var filterOutput = reverseFilter({ test: 'object' });
		
        expect( filterOutput ).toEqual( { test: 'object' } );
    });

    it('does not change the input object if it is not an array but an int', function () {
        var filterOutput = reverseFilter(3);
		
        expect( filterOutput ).toEqual( 3 );
    });
});
