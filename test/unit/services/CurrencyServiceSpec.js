'use strict';

/**
 * Unit Test for "CurrencyService".
 */
describe('CurrencyService', function() {
	var $q,
	    $httpBackend,
	    currencyService;

	var constants = {
		fromCurrency: 'USD',
		toCurrency: 'CAD',
		interval: 60,
		period: '1d'
	};

	var expectedResponses = {
		getCurrencyExchangeRate: {
			"query": {
				"count": 1,
				"created": "2015-01-04T05:14:37Z",
				"lang": "en-US",
				"results": {
					"rate": {
						"id": "USDCAD",
						"Name": "USD to CAD",
						"Rate": "1.1785",
						"Date": "1/3/2015",
						"Time": "7:55am",
						"Ask": "1.179",
						"Bid": "1.178"
					}
				}
			}
		},
		getCurrencyExchangeRateHistory: {
			"query": {
				"count": 19,
				"created": "2015-01-04T04:22:19Z",
				"lang": "en-US",
				"results": {
					"row": [{
						"col0": "EXCHANGE%3DCURRENCY"
					},
					{
						"col0": "MARKET_OPEN_MINUTE=0"
					},
					{
						"col0": "MARKET_CLOSE_MINUTE=1438"
					},
					{
						"col0": "INTERVAL=60"
					},
					{
						"col0": "COLUMNS=DATE",
						"col1": "CLOSE",
						"col2": "HIGH",
						"col3": "LOW",
						"col4": "OPEN",
						"col5": "VOLUME",
						"col6": "CDAYS"
					},
					{
						"col0": "DATA="
					},
					{
						"col0": "TIMEZONE_OFFSET=0"
					},
					{
						"col0": "a1420156800",
						"col1": "1.161695",
						"col2": "0.000000",
						"col3": "0.000000",
						"col4": "0.000000",
						"col5": "0",
						"col6": "0"
					},
					{
						"col0": "1",
						"col1": "1.161885",
						"col2": "0.000000",
						"col3": "0.000000",
						"col4": "0.000000",
						"col5": "0",
						"col6": "0"
					},
					{
						"col0": "2",
						"col1": "1.16186",
						"col2": "0.00000",
						"col3": "0.00000",
						"col4": "0.00000",
						"col5": "0",
						"col6": "0"
					},
					{
						"col0": "3",
						"col1": "1.16205",
						"col2": "0.00000",
						"col3": "0.00000",
						"col4": "0.00000",
						"col5": "0",
						"col6": "0"
					},
					{
						"col0": "4",
						"col1": "1.16205",
						"col2": "0.00000",
						"col3": "0.00000",
						"col4": "0.00000",
						"col5": "0",
						"col6": "0"
					},
					// [...]
					{
						"col0": "999",
						"col1": "1.172165",
						"col2": "0.000000",
						"col3": "0.000000",
						"col4": "0.000000",
						"col5": "0",
						"col6": "0"
					},
					{
						"col0": "a1420216800",
						"col1": "1.1724",
						"col2": "0.0000",
						"col3": "0.0000",
						"col4": "0.0000",
						"col5": "0",
						"col6": "0"
					},
					{
						"col0": "1",
						"col1": "1.1724",
						"col2": "0.0000",
						"col3": "0.0000",
						"col4": "0.0000",
						"col5": "0",
						"col6": "0"
					},
					{
						"col0": "2",
						"col1": "1.172885",
						"col2": "0.000000",
						"col3": "0.000000",
						"col4": "0.000000",
						"col5": "0",
						"col6": "0"
					},
					// [...]
					{
						"col0": "999",
						"col1": "1.1785",
						"col2": "0.0000",
						"col3": "0.0000",
						"col4": "0.0000",
						"col5": "0",
						"col6": "0"
					},
					{
						"col0": "a1420276860",
						"col1": "1.1785",
						"col2": "0.0000",
						"col3": "0.0000",
						"col4": "0.0000",
						"col5": "0",
						"col6": "0"
					},
					{
						"col0": "2",
						"col1": "1.1785",
						"col2": "0.0000",
						"col3": "0.0000",
						"col4": "0.0000",
						"col5": "0",
						"col6": "0"
					}]
				}
			}
		}
	};

	var formattedResponses = {
		getCurrencyExchangeRate: {
			'query': {
				'count': 1,
				'created': '2015-01-04T03:22:43Z',
				'lang': 'en-US',
				'results': {
					'rate': {
						'id': 'USDCAD',
						'Name': 'USD to CAD',
						'Rate': parseFloat('1.1785', 10),
						'Date': '1/3/2015',
						'Time': '7:55am',
						'Ask': parseFloat('1.179', 10),
						'Bid': parseFloat('1.178', 10)
					}
				}
			}
		},
		getCurrencyExchangeRateHistory: [
			[ new Date("Fri Jan 02 2015 00:00:00 GMT-0500 (EST)"), 1.161695 ],
			[ new Date("Fri Jan 02 2015 00:01:00 GMT-0500 (EST)"), 1.161885 ],
			[ new Date("Fri Jan 02 2015 00:02:00 GMT-0500 (EST)"), 1.161860 ],
			[ new Date("Fri Jan 02 2015 00:03:00 GMT-0500 (EST)"), 1.162050 ],
			[ new Date("Fri Jan 02 2015 00:04:00 GMT-0500 (EST)"), 1.162050 ],
			[ new Date("Fri Jan 02 2015 16:39:00 GMT-0500 (EST)"), 1.172165 ],
			[ new Date("Fri Jan 02 2015 16:40:00 GMT-0500 (EST)"), 1.172400 ],
			[ new Date("Fri Jan 02 2015 16:41:00 GMT-0500 (EST)"), 1.172400 ],
			[ new Date("Fri Jan 02 2015 16:42:00 GMT-0500 (EST)"), 1.172885 ],
			[ new Date("Sat Jan 03 2015 09:19:00 GMT-0500 (EST)"), 1.178500 ],
			[ new Date("Sat Jan 03 2015 09:21:00 GMT-0500 (EST)"), 1.178500 ],
			[ new Date("Sat Jan 03 2015 09:23:00 GMT-0500 (EST)"), 1.178500 ]
		]
	};

	// Set up the module:
	beforeEach(module('stockWatcher'));

	beforeEach(inject(function($injector) {
		// Get objects to test:
		$q = $injector.get('$q');
		$httpBackend = $injector.get('$httpBackend');
		currencyService = $injector.get('currencyService');

		// Setup expected backend responses:
		//$httpBackend
		//	.when('JSONP', "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3DPG%26f%3Da0a2a5b0b2b3b4b6c0c1c3c4c6c8d0d1d2e0e1e7e8e9h0j0k0g0g1g3g4g5g6i0i5j0j1j3j4j5j6k0k1k2k4k5l0l1l2l3m0m2m3m4m5m6m7m8n0n4o0p0p1p2p5p6q0r0r1r2r5r6r7s0s1s6s7t1t7t8v0v1v7w0w1w4x0y0%26e%3D.csv'%20and%20columns%3D'Ask%2CAverageDailyVolume%2CAskSize%2CBid%2CAskRealTime%2CBidRealTime%2CBookValue%2CBidSize%2CChangeAndPercentChange%2CChange%2CCommission%2CCurrency%2CChangeRealTime%2CAfterHoursChangeRealTime%2CDividendPerShare%2CLastTradeDate%2CTradeDate%2CEarningsPerShare%2CErrorIndication%2CEPSEstimateCurrentYear%2CEPSEstimateNextYear%2CEPSEstimateNextQuarter%2CDaysHigh%2C_52WeekLow%2C_52WeekHigh%2CDaysLow%2CHoldingsGainPercent%2CAnnualizedGain%2CHoldingsGain%2CHoldingsGainPercentRealTime%2CHoldingsGainRealTime%2CMoreInfo%2COrderBookRealTime%2CYearLow%2CMarketCapitalization%2CMarketCapRealTime%2CEBITDA%2CChangeFrom52WeekLow%2CPercentChangeFrom52WeekLow%2CYearHigh%2CLastTradeRealTimeWithTime%2CChangePercentRealTime%2CChangeFrom52WeekHigh%2CPercentChangeFrom52WeekHigh%2CLastTradeWithTime%2CLastTradePriceOnly%2CHighLimit%2CLowLimit%2CDaysRange%2CDaysRangeRealTime%2C_50DayMovingAverage%2C_200DayMovingAverage%2CChangeFrom200DayMovingAverage%2CPercentChangeFrom200DayMovingAverage%2CChangeFrom50DayMovingAverage%2CPercentChangeFrom50DayMovingAverage%2CName%2CNotes%2COpen%2CPreviousClose%2CPricePaid%2CChangeInPercent%2CPricePerSales%2CPricePerBook%2CExDividendDate%2CPERatio%2CDividendPayDate%2CPERatioRealTime%2CPEGRatio%2CPricePerEPSEstimateCurrentYear%2CPricePerEPSEstimateNextYear%2CSymbol%2CSharesOwned%2CRevenue%2CShortRatio%2CLastTradeTime%2CTickerTrend%2C_1YearTargetPrice%2CVolume%2CHoldingsValue%2CHoldingsValueRealTime%2C_52WeekRange%2CDaysValueChange%2CDaysValueChangeRealTime%2CStockExchange%2CDividendYield'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
		//	.respond(expectedResponse.getCurrencyExchangeRate);
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});


	/**
	 * Unit Tests for "getCurrencyExchangeRate()".
	 */
	describe('getCurrencyExchangeRate', function() {
		it('should call the expected YQL URL and return the correctly-formatted data', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22" + constants.fromCurrency + constants.toCurrency + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getCurrencyExchangeRate);

			var exchangeRate = undefined;
			var exchangeRatePromise = currencyService.getCurrencyExchangeRate(constants.fromCurrency, constants.toCurrency);
			exchangeRatePromise.then(function(data) {
				exchangeRate = data;
			});

			$httpBackend.flush();

			expect(exchangeRate).toBeDefined();
			expect(exchangeRate).toEqual(formattedResponses.getCurrencyExchangeRate.query.results.rate);
		});
	});


	/**
	 * Unit Tests for "getCurrencyExchangeRateHistory()".
	 */
	describe('getCurrencyExchangeRateHistory', function() {
		it('should call the expected YQL URL and return the correctly-formatted data', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20csv%20WHERE%20url%3D%22http%3A%2F%2Fwww.google.com%2Ffinance%2Fgetprices%3Fq%3D" + constants.fromCurrency + constants.toCurrency + "%26i%3D" + constants.interval + "%26p%3D" + constants.period + "%26f%3Dd%2Cc%2Cv%2Ck%2Co%2Ch%2Cl%26df%3Dcpct%26auto%3D0%26ei%3DEf6XUYDfCqSTiAKEMg%22&format=json&callback=JSON_CALLBACK")
				.respond(expectedResponses.getCurrencyExchangeRateHistory);

			var historicalExchangeRateHistory = undefined;
			var historicalExchangeRateHistoryPromise = currencyService.getCurrencyExchangeRateHistory(constants.fromCurrency, constants.toCurrency, constants.interval, constants.period);
			historicalExchangeRateHistoryPromise.then(function(data) {
				historicalExchangeRateHistory = data;
			});

			$httpBackend.flush();

			expect(historicalExchangeRateHistory).toBeDefined();
			expect(historicalExchangeRateHistory).toEqual(formattedResponses.getCurrencyExchangeRateHistory);
		});
	});
});
