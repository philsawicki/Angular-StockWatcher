'use strict';

/**
 * Unit Tests for "StorageService".
 */
describe('StorageService', function() {
	var storageService = undefined;

	var constants = {
		storageKey: 'storageKey',
		storageValue: 'storageValue',

		storageJSONKey: 'storageJSONKey',
		storageJSONValue: {
			int: 1,
			float: 42.33,
			string: 'test',
			object: {
				data: 'test'
			}
		}
	};


	// Set up the module:
	beforeEach(module('stockWatcher'));

	beforeEach(inject(function($injector) {
		// Get objects to test:
		storageService = $injector.get('storageService');
	}));


	it('can store data', function() {
		storageService.setData(constants.storageKey, constants.storageValue);

		var storedValue = storageService.getData(constants.storageKey);

		expect(storedValue).toEqual(constants.storageValue);
	});

	it('returns "undefined" it the requested key does not exist', function() {
		var storedValue = storageService.getData('nonExistingStorageKey');

		expect(storedValue).toEqual(undefined);
	});

	it('can overwrite stored data', function() {
		storageService.setData(constants.storageKey, constants.storageValue);

		var originalValue = storageService.getData(constants.storageKey);

		expect(originalValue).toEqual(constants.storageValue);

		storageService.setData(constants.storageKey, 'TEST');

		var modifiedValue = storageService.getData(constants.storageKey);

		expect(modifiedValue).toEqual('TEST');
	});

	it('can restore JSON-serialized data', function() {
		storageService.setData(constants.storageJSONKey, JSON.stringify(constants.storageJSONValue));

		var storedValue = JSON.parse(storageService.getData(constants.storageJSONKey));

		expect(storedValue).toEqual(constants.storageJSONValue);
	});

	it('can delete data', function() {
		storageService.setData(constants.storageKey, constants.storageValue);

		var storedValue = storageService.getData(constants.storageKey);

		expect(storedValue).toEqual(constants.storageValue);

		storageService.deleteData(constants.storageKey);

		var storedValue = storageService.getData(constants.storageKey);

		expect(storedValue).toEqual(undefined);
	});

	it('can clear all data', function() {
		storageService.setData(constants.storageKey, constants.storageValue);
		storageService.setData(constants.storageJSONKey, JSON.stringify(constants.storageJSONValue));

		var storedValue = storageService.getData(constants.storageKey);
		var storedJSONValue = JSON.parse(storageService.getData(constants.storageJSONKey));

		expect(storedValue).toEqual(constants.storageValue);
		expect(storedJSONValue).toEqual(constants.storageJSONValue);

		storageService.deleteAllData();

		var storedValue = storageService.getData(constants.storageKey);
		var storedJSONValue = JSON.parse(storageService.getData(constants.storageJSONKey));

		expect(storedValue).toEqual(undefined);
		expect(storedJSONValue).toEqual(undefined);
	});
	
	xit('returns "undefined" when localStorage is not supported', function () {
		$window.localStorage = false;
		
		storageService.setData(constants.storageKey, constants.storageValue);

		var storedValue = storageService.getData(constants.storageKey);

		expect(storedValue).toBeUndefined();
	});
});
