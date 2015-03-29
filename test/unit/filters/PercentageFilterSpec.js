'use strict';

/**
 * Unit Tests for "PercentageFilter".
 */
describe('Percentage Filter', function () {
    var $filter = undefined,
        percentageFilter = undefined;

    // Set up the module:
    beforeEach(module('stockWatcher'));

    beforeEach(inject(function ($injector) {
        // Get objects to test:
        $filter = $injector.get('$filter');
        percentageFilter = $filter('percentage');
    }));


    it('formats decimals as percentage', function () {
        var filterOutput = percentageFilter(0.10);
		
        expect( filterOutput ).toBe( '0.1%' );
    });

    it('outputs a string with a "%" sign', function () {
        var filterOutput = percentageFilter(0.10);

        expect( filterOutput ).toContain( '%' );
    });

    it('defaults to 3 decimals', function () {
        var filterOutput = percentageFilter(0.123456);

        expect( filterOutput ).toBe( '0.123%' );
    });

    it('outputs data to the specified number of decimals', function () {
        var filterOutput = percentageFilter(0.1111111, 4);

        expect( filterOutput ).toBe( '0.1111%' );
    });

    it('rounds the output to the nearest value', function () {
        var filterOutput = percentageFilter(0.123456, 4);

        expect( filterOutput ).toBe( '0.1235%' );
    });

    it('does not format strings', function () {
        var filterOutput = percentageFilter('test');

        expect( filterOutput ).not.toContain( '%' );
        expect( filterOutput ).toBe( 'test' );
    });

    it('does not wrongly format already-formatted percentage', function () {
        var filterOutput1 = percentageFilter('50.0%');
        var filterOutput2 = percentageFilter('50.123%', 2);

        expect( filterOutput1 ).toBe( '50%' );
        expect( filterOutput2 ).toBe( '50.12%' );
    });

    it('correctly formats negative numbers', function () {
        var filterOutput = percentageFilter(-0.1234);

        expect( filterOutput ).toBe( '-0.123%' );
    });

    it('correctly formats negative string numbers', function () {
        var filterOutput = percentageFilter('-0.1234');

        expect( filterOutput ).toBe( '-0.123%' );
    });
});
