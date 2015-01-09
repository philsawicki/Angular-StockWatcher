'use strict';

/**
 * Application Configuration Provider.
 */
angular.module('stockWatcher.Providers')
	.provider('appConfig', function() {
		// Initial/default config:
		var appConfig = {
			JSONPTimeout: 10*1000 // Delay before assuming that a JSONP request failed due to a timeout (in ms)
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
