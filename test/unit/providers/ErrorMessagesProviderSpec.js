'use strict';

/**
 * Unit Tests for "ErrorMessagesProvider".
 */
describe('ErrorMessagesProvider', function() {
	var errorMessages = undefined;

	var constants = {
		messageKey: 'key',
		messageValue: 'value'
	};

	// Set up the module:
	beforeEach(function() {
		module('stockWatcher.Providers', ['errorMessagesProvider', function (errorMessagesProvider) {
			errorMessagesProvider.set(constants.messageKey, constants.messageValue);
		}]);
    	module('stockWatcher');
	});

	beforeEach(inject(function($injector) {
		// Get objects to test:
		errorMessages = $injector.get('errorMessages');
	}));


	it('should return defined values', function() {
		var definedValue = errorMessages.NoData.Error;

		expect(definedValue).toBeDefined();
	});

	it('should not return undefined values', function() {
		var undefinedValue = errorMessages.NonExisting;

		expect(undefinedValue).toBeUndefined();
	});

	it('should return values added when calling "app.config(...)"', function() {
		var errorValue = errorMessages[constants.messageKey];

		expect(errorValue).toBeDefined();
		expect(errorValue).toEqual(constants.messageValue);
	});
});
