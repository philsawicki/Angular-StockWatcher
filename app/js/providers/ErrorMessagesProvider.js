'use strict';

/**
 * Error Messages Provider.
 */
angular.module('stockWatcher.Providers')
	.provider('errorMessages', function() {
		// Initial/default messages:
		var errorMessages = {
			NoData: {
				Error: 'NoData',
				Message: 'No data received'
			},
			Timeout: {
				Error: 'Timeout',
				Message: 'Request took longer than {0}ms'
			}
		};

		return {
			// "errorMessages.set(...)" can only be called during "app.config(...)", as:
			//    app.config(['errorMessagesProvider', function(errorMessagesProvider) {
			//       errorMessagesProvider.set('key', 'value');
			//    }]);
			set: function(key, value) {
				errorMessages[key] = value;
			},
			$get: function() {
				return errorMessages;
			}
		};
	});
