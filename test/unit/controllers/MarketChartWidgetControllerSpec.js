'use strict';

/**
 * Unit Tests for "MarketChartWidgetController".
 */
describe('MarketChartWidgetController', function () {
    var $scope,
        controller;


    beforeEach(module('stockWatcher'));

    beforeEach(inject(function ($controller) {
        $scope = {};
        controller = $controller('MarketChartWidgetController', { $scope: $scope });
    }));


    it('should exist', function () {
        expect( controller ).toBeDefined();
        expect( controller ).not.toBeNull();
    });

    describe('The toggling of the Title', function () {
        it('should toggle the Title visibility', function () {
            var initialShowTitle = $scope.showTitle;

            $scope.toggleTitle();

            var finalShowTitle = $scope.showTitle;

            expect( finalShowTitle ).toEqual( !initialShowTitle );
        });
    });

    describe('The toggling of the Zoom', function () {
        it('should toggle the Zoom visibility', function () {
            var initialShowZoom = $scope.showZoom;

            $scope.toggleZoom();

            var finalShowZoom = $scope.showZoom;

            expect( finalShowZoom ).toEqual( !initialShowZoom );
        });
    });

    describe('The toggling of the Date Picker', function () {
        it('should toggle the Date Picker visibility', function () {
            var initialShowDatePicker = $scope.showDatePicker;

            $scope.toggleDatePicker();

            var finalShowDatePicker = $scope.showDatePicker;

            expect( finalShowDatePicker ).toEqual( !initialShowDatePicker );
        });
    });

    describe('The toggling of the Navigator', function () {
        it('should toggle the Navigator visibility', function () {
            var initialShowNavigator = $scope.showNavigator;

            $scope.toggleNavigator();

            var finalShowNavigator = $scope.showNavigator;

            expect( finalShowNavigator ).toEqual( !initialShowNavigator );
        });
    });
});
