'use strict';

/**
 * Application Configuration Provider.
 */
angular.module('stockWatcher.Providers')
	.provider('appConfig', function() {
		var storageKeyPrefix = 'AngularStockWatcher_localStorage_';

		// Initial/default config:
		var appConfig = {
			JSONPTimeout: 10*1000, // Delay before assuming that a JSONP request failed due to a timeout (in ms)
			StorageKeys: { // Keys to access stored values (currently serialized to "localStorage")
				StoredQuotes: storageKeyPrefix + 'storedQuotes' // Quotes saved to localStorage.
			}
		};

		return {
			// "appConfig.set(...)" can only be called during "app.config(...)", as:
			//    app.config(['appConfigProvider', function(appConfigProvider) {
			//       appConfigProvider.set('key', 'value');
			//    }]);
			set: function(key, value) {
				appConfig[key] = value;
			},
			$get: function() {
				return appConfig;
			}
		};
	});
