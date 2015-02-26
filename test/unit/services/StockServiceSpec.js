'use strict';

/**
 * Unit Test for "StockService".
 */
describe('StockService', function() {
	var $q,
	    $httpBackend,
	    $timeout,
	    appConfig,
	    stockService,
	    errorMessages;

	var constants = {
		symbol: 'PG',
		marketSymbol: '.INX',
		startDate: '2014-12-03',
		endDate: '2014-12-06',
		exchange: 'NYSE',
		interval: 60,
		period: '1d'
	};

	var expectedResponses = {
		getHistoricalData: {
			"query": {
				"count": 3,
				"created": "2015-01-04T06:17:45Z",
				"lang": "en-US",
				"results": {
					"quote": [
					{
						"Symbol": "PG",
						"Date": "2014-12-05",
						"Open": "90.32",
						"High": "90.42",
						"Low": "89.21",
						"Close": "90.38",
						"Volume": "6377500",
						"Adj_Close": "90.38"
					},
					{
						"Symbol": "PG",
						"Date": "2014-12-04",
						"Open": "90.50",
						"High": "90.94",
						"Low": "90.10",
						"Close": "90.58",
						"Volume": "6406700",
						"Adj_Close": "90.58"
					},
					{
						"Symbol": "PG",
						"Date": "2014-12-03",
						"Open": "90.84",
						"High": "90.97",
						"Low": "89.64",
						"Close": "90.00",
						"Volume": "6260400",
						"Adj_Close": "90.00"
					}]
				}
			}
		},
		getCurrentData: {
			"query": {
				"count": 1,
				"created": "2015-01-04T06:49:11Z",
				"lang": "en-US",
				"results": {
					"quote": {
						"symbol": "PG",
						"AverageDailyVolume": "7778830",
						"Change": "-0.65",
						"DaysLow": "89.92",
						"DaysHigh": "91.00",
						"YearLow": "75.26",
						"YearHigh": "93.89",
						"MarketCapitalization": "244.4B",
						"LastTradePriceOnly": "90.44",
						"DaysRange": "89.92 - 91.00",
						"Name": "Procter & Gamble",
						"Symbol": "PG",
						"Volume": "7255494",
						"StockExchange": "NYSE"
					}
				}
			}
		},
		getCurrentDataWithDetails: {
			"query": {
				"count": 1,
				"created": "2015-01-04T07:11:13Z",
				"lang": "en-US",
				"results": {
					"row": {
						"Ask": "N/A",
						"AverageDailyVolume": "7778830",
						"AskSize": "N/A",
						"Bid": "N/A",
						"AskRealTime": "93.20",
						"BidRealTime": "90.18",
						"BookValue": "24.038",
						"BidSize": "N/A",
						"ChangeAndPercentChange": "-0.65 - -0.71%",
						"Change": "-0.65",
						"Commission": "-",
						"Currency": "USD",
						"ChangeRealTime": "-0.65",
						"AfterHoursChangeRealTime": "N/A - N/A",
						"DividendPerShare": "2.534",
						"LastTradeDate": "1/2/2015",
						"TradeDate": "-",
						"EarningsPerShare": "3.663",
						"ErrorIndication": "N/A",
						"EPSEstimateCurrentYear": "4.34",
						"EPSEstimateNextYear": "4.69",
						"EPSEstimateNextQuarter": "1.08",
						"DaysHigh": "91.00",
						"_52WeekLow": "75.26",
						"_52WeekHigh": "93.89",
						"DaysLow": "89.92",
						"HoldingsGainPercent": "- - -",
						"AnnualizedGain": "-",
						"HoldingsGain": "-",
						"HoldingsGainPercentRealTime": "N/A - N/A",
						"HoldingsGainRealTime": "N/A",
						"MoreInfo": "cn",
						"OrderBookRealTime": "N/A",
						"YearLow": "75.26",
						"MarketCapitalization": "244.4B",
						"MarketCapRealTime": "N/A",
						"EBITDA": "19.175B",
						"ChangeFrom52WeekLow": "+15.18",
						"PercentChangeFrom52WeekLow": "+20.17%",
						"YearHigh": "93.89",
						"LastTradeRealTimeWithTime": "N/A - <b>90.44</b>",
						"ChangePercentRealTime": "N/A - -0.71%",
						"ChangeFrom52WeekHigh": "-3.45",
						"PercentChangeFrom52WeekHigh": "-3.67%",
						"LastTradeWithTime": "Jan  2 - <b>90.44</b>",
						"LastTradePriceOnly": "90.44",
						"HighLimit": "-",
						"LowLimit": "-",
						"DaysRange": "89.92 - 91.00",
						"DaysRangeRealTime": "N/A - N/A",
						"_50DayMovingAverage": "90.3585",
						"_200DayMovingAverage": "84.5965",
						"ChangeFrom200DayMovingAverage": "+5.8435",
						"PercentChangeFrom200DayMovingAverage": "+6.91%",
						"ChangeFrom50DayMovingAverage": "+0.0815",
						"PercentChangeFrom50DayMovingAverage": "+0.09%",
						"Name": "Procter & Gamble ",
						"Notes": "-",
						"Open": "90.89",
						"PreviousClose": "91.09",
						"PricePaid": "-",
						"ChangeInPercent": "-0.71%",
						"PricePerSales": "2.96",
						"PricePerBook": "3.79",
						"ExDividendDate": "Oct 22",
						"PERatio": "24.87",
						"DividendPayDate": "Nov 17",
						"PERatioRealTime": "N/A",
						"PEGRatio": "2.62",
						"PricePerEPSEstimateCurrentYear": "20.99",
						"PricePerEPSEstimateNextYear": "19.42",
						"Symbol": "PG",
						"SharesOwned": "-",
						"Revenue": "83.024B",
						"ShortRatio": "3.80",
						"LastTradeTime": "4:02pm",
						"TickerTrend": " =====+ ",
						"_1YearTargetPrice": "91.65",
						"Volume": "7255494",
						"HoldingsValue": "-",
						"HoldingsValueRealTime": "N/A",
						"_52WeekRange": "75.26 - 93.89",
						"DaysValueChange": "- - -0.71%",
						"DaysValueChangeRealTime": "N/A - N/A",
						"StockExchange": "NYSE",
						"DividendYield": "2.78"
					}
				}
			}
		},
		getLiveData: {
			"query": {
				"count": 18,
				"created": "2015-01-04T07:31:10Z",
				"lang": "en-US",
				"results": {
					"row": [
					{
						"col0": "EXCHANGE%3DNYSE"
					},
					{
						"col0": "MARKET_OPEN_MINUTE=570"
					},
					{
						"col0": "MARKET_CLOSE_MINUTE=960"
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
						"col0": "TIMEZONE_OFFSET=-300"
					},
					{
						"col0": "a1419949800",
						"col1": "92.29",
						"col2": "92.29",
						"col3": "92.25",
						"col4": "92.25",
						"col5": "800",
						"col6": "0"
					},
					{
						"col0": "1",
						"col1": "92.57",
						"col2": "92.6",
						"col3": "92.29",
						"col4": "92.29",
						"col5": "111033",
						"col6": "0"
					},
					{
						"col0": "2",
						"col1": "92.658",
						"col2": "92.69",
						"col3": "92.52",
						"col4": "92.54",
						"col5": "29770",
						"col6": "0"
					},
					{
						"col0": "390",
						"col1": "92.38",
						"col2": "92.42",
						"col3": "92.38",
						"col4": "92.41",
						"col5": "59723",
						"col6": "0"
					},
					{
						"col0": "a1420036260",
						"col1": "92.3",
						"col2": "92.43",
						"col3": "92.02",
						"col4": "92.04",
						"col5": "274163",
						"col6": "0"
					},
					{
						"col0": "1",
						"col1": "92.17",
						"col2": "92.32",
						"col3": "92.03",
						"col4": "92.2702",
						"col5": "29725",
						"col6": "0"
					},
					{
						"col0": "2",
						"col1": "92.28",
						"col2": "92.32",
						"col3": "92.12",
						"col4": "92.12",
						"col5": "40436",
						"col6": "0"
					},
					{
						"col0": "389",
						"col1": "91.11",
						"col2": "91.24",
						"col3": "91.06",
						"col4": "91.21",
						"col5": "230600",
						"col6": "0"
					},
					{
						"col0": "a1420209000",
						"col1": "90.84",
						"col2": "90.84",
						"col3": "90.84",
						"col4": "90.84",
						"col5": "700",
						"col6": "0"
					},
					{
						"col0": "1",
						"col1": "90.72",
						"col2": "91",
						"col3": "90.65",
						"col4": "90.95",
						"col5": "333992",
						"col6": "0"
					},
					{
						"col0": "2",
						"col1": "90.389",
						"col2": "90.72",
						"col3": "90.03",
						"col4": "90.72",
						"col5": "164592",
						"col6": "0"
					}]
				}
			}
		},
		getLiveMarketData: {
			"query": {
				"count": 15,
				"created": "2015-01-04T08:27:22Z",
				"lang": "en-US",
				"results": {
					"row": [{
						"col0": "EXCHANGE%3DINDEXSP"
					},
					{
						"col0": "MARKET_OPEN_MINUTE=570"
					},
					{
						"col0": "MARKET_CLOSE_MINUTE=960"
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
						"col0": "TIMEZONE_OFFSET=-300"
					},
					{
						"col0": "a1420036260",
						"col1": "2083.61",
						"col2": "2084.12",
						"col3": "2082.11",
						"col4": "2082.11",
						"col5": "0",
						"col6": "0"
					},
					{
						"col0": "1",
						"col1": "2083.21",
						"col2": "2083.63",
						"col3": "2083.12",
						"col4": "2083.63",
						"col5": "0",
						"col6": "0"
					},
					{
						"col0": "2",
						"col1": "2082.09",
						"col2": "2083.07",
						"col3": "2082.06",
						"col4": "2083.02",
						"col5": "0",
						"col6": "0"
					},
					// [...]
					{
						"col0": "389",
						"col1": "2059.19",
						"col2": "2060.96",
						"col3": "2059.12",
						"col4": "2060.96",
						"col5": "0",
						"col6": "0"
					},
					{
						"col0": "a1420209060",
						"col1": "2066.37",
						"col2": "2066.44",
						"col3": "2058.9",
						"col4": "2058.9",
						"col5": "0",
						"col6": "0"
					},
					{
						"col0": "1",
						"col1": "2067.57",
						"col2": "2067.57",
						"col3": "2065.93",
						"col4": "2066.41",
						"col5": "0",
						"col6": "0"
					},
					{
						"col0": "2",
						"col1": "2070.06",
						"col2": "2070.06",
						"col3": "2067.56",
						"col4": "2067.56",
						"col5": "0",
						"col6": "0"
					},
					// [...]
					{
						"col0": "389",
						"col1": "2058.03",
						"col2": "2060.01",
						"col3": "2058.03",
						"col4": "2059.39",
						"col5": "0",
						"col6": "0"
					}]
				}
			}
		},
		getDataWithoutAnyResults: {
			"query": {
				"count": 0,
				"created": "2015-01-04T07:31:10Z",
				"lang": "en-US",
				"results": {
					"row": [
					{
						"col0": "EXCHANGE%3DNYSE"
					},
					{
						"col0": "MARKET_OPEN_MINUTE=570"
					},
					{
						"col0": "MARKET_CLOSE_MINUTE=960"
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
						"col0": "TIMEZONE_OFFSET=-300"
					}]
				}
			},
		},
		getDataWithYQLError: {
			error: 'YQLError',
			message: 'Check "data" for details',
			data: {
				description: 'No definition found for Table fed',
				lang: 'en-US'
			}
		},
		getCurrentDataWithDetailsWithoutAnyResults: {
			"query": {
				"count": 0,
				"created": "2015-01-04T07:11:13Z",
				"lang": "en-US",
				"results": {
					"row": {
						// No data
					}
				}
			}
		},
		getNewsFeedForStock: {
			"query": {
				"count": 2,
				"created": "2015-01-15T00:30:52Z",
				"lang": "en-US",
				"results": {
					"item": [
						{
							"title": "[$$] Canada's Banks Try to Downplay Exposure to Energy",
							"link": "http://us.rd.yahoo.com/finance/external/wsj/rss/SIG=12s72krs2/*http://online.wsj.com/articles/canadas-banks-try-to-downplay-exposure-to-energy-1421276192?mod=yahoo_hs",
							"description": null,
							"guid": {
								"isPermaLink": "false",
								"content": "yahoo_finance/847897861"
							},
							"pubDate": "Wed, 14 Jan 2015 22:56:35 GMT"
						},
						{
							"title": "New Issue- TD prices 500 mln stg 2018 FRN",
							"link": "http://us.rd.yahoo.com/finance/news/rss/story/*http://finance.yahoo.com/news/issue-td-prices-500-mln-145852262.html",
							"description": "[Reuters] - Following are terms and conditions of a FRN priced on Wednesday. Borrower The Toronto-Dominion Bank Issue Amount 500 million sterling Maturity Date January 19, 2018 Coupon 3-month Libor + 38 basis points ...",
							"guid": {
								"isPermaLink": "false",
								"content": "yahoo_finance/3662427357"
							},
							"pubDate": "Wed, 14 Jan 2015 14:58:52 GMT"
						}
					]
				}
			}
		},
		getDividendHistoryForStock: {
			'query': {
				'count': 2,
				'created': '2015-01-18T20:36:47Z',
				'lang': 'en-US',
				'results': {
					'quote': [
						{
							'Symbol': constants.symbol,
							'Date': '2014-11-26',
							'Dividends': '0.305000'
						},
						{
							'Symbol': constants.symbol,
							'Date': '2014-09-11',
							'Dividends': '0.305000'
						}
					]
				}
			}
		}
	};

	var formattedResponses = {
		getLiveData: [
			[ new Date("Tue Dec 30 2014 09:30:00"), 92.290 ],
			[ new Date("Tue Dec 30 2014 09:31:00"), 92.570 ],
			[ new Date("Tue Dec 30 2014 09:32:00"), 92.658 ],
			[ new Date("Tue Dec 30 2014 16:00:00"), 92.380 ],
			[ new Date("Wed Dec 31 2014 09:31:00"), 92.300 ],
			[ new Date("Wed Dec 31 2014 09:32:00"), 92.170 ],
			[ new Date("Wed Dec 31 2014 09:33:00"), 92.280 ],
			[ new Date("Wed Dec 31 2014 16:00:00"), 91.110 ],
			[ new Date("Fri Jan 02 2015 09:30:00"), 90.840 ],
			[ new Date("Fri Jan 02 2015 09:31:00"), 90.720 ],
			[ new Date("Fri Jan 02 2015 09:32:00"), 90.389 ]
		],
		getLiveMarketData: [
			[ new Date("Wed Dec 31 2014 09:31:00"), 2083.61 ],
			[ new Date("Wed Dec 31 2014 09:32:00"), 2083.21 ],
			[ new Date("Wed Dec 31 2014 09:33:00"), 2082.09 ],
			[ new Date("Wed Dec 31 2014 16:00:00"), 2059.19 ],
			[ new Date("Fri Jan 02 2015 09:31:00"), 2066.37 ],
			[ new Date("Fri Jan 02 2015 09:32:00"), 2067.57 ],
			[ new Date("Fri Jan 02 2015 09:33:00"), 2070.06 ],
			[ new Date("Fri Jan 02 2015 16:00:00"), 2058.03 ]
		],
		getCurrentDataWithDetails: {
			"query": {
				"count": 1,
				"created": "2015-01-04T07:11:13Z",
				"lang": "en-US",
				"results": {
					"row": {
						"Ask": "N/A",
						"AverageDailyVolume": "7778830",
						"AskSize": "N/A",
						"Bid": "N/A",
						"AskRealTime": "93.20",
						"BidRealTime": "90.18",
						"BookValue": "24.038",
						"BidSize": "N/A",
						"ChangeAndPercentChange": "-0.65 - -0.71%",
						"Change": -0.65,
						"Commission": "-",
						"Currency": "USD",
						"ChangeRealTime": "-0.65",
						"AfterHoursChangeRealTime": "N/A - N/A",
						"DividendPerShare": "2.534",
						"LastTradeDate": "1/2/2015",
						"TradeDate": "-",
						"EarningsPerShare": "3.663",
						"ErrorIndication": "N/A",
						"EPSEstimateCurrentYear": "4.34",
						"EPSEstimateNextYear": "4.69",
						"EPSEstimateNextQuarter": "1.08",
						"DaysHigh": "91.00",
						"_52WeekLow": "75.26",
						"_52WeekHigh": "93.89",
						"DaysLow": "89.92",
						"HoldingsGainPercent": "- - -",
						"AnnualizedGain": "-",
						"HoldingsGain": "-",
						"HoldingsGainPercentRealTime": "N/A - N/A",
						"HoldingsGainRealTime": "N/A",
						"MoreInfo": "cn",
						"OrderBookRealTime": "N/A",
						"YearLow": "75.26",
						"MarketCapitalization": "244.4B",
						"MarketCapRealTime": "N/A",
						"EBITDA": "19.175B",
						"ChangeFrom52WeekLow": "+15.18",
						"PercentChangeFrom52WeekLow": "+20.17%",
						"YearHigh": "93.89",
						"LastTradeRealTimeWithTime": "N/A - <b>90.44</b>",
						"ChangePercentRealTime": "N/A - -0.71%",
						"ChangeFrom52WeekHigh": "-3.45",
						"PercentChangeFrom52WeekHigh": "-3.67%",
						"LastTradeWithTime": "Jan  2 - <b>90.44</b>",
						"LastTradePriceOnly": 90.44,
						"HighLimit": "-",
						"LowLimit": "-",
						"DaysRange": "89.92 - 91.00",
						"DaysRangeRealTime": "N/A - N/A",
						"_50DayMovingAverage": "90.3585",
						"_200DayMovingAverage": "84.5965",
						"ChangeFrom200DayMovingAverage": "+5.8435",
						"PercentChangeFrom200DayMovingAverage": "+6.91%",
						"ChangeFrom50DayMovingAverage": "+0.0815",
						"PercentChangeFrom50DayMovingAverage": "+0.09%",
						"Name": "Procter & Gamble ",
						"Notes": "-",
						"Open": "90.89",
						"PreviousClose": "91.09",
						"PricePaid": "-",
						"ChangeInPercent": -0.71,
						"PricePerSales": "2.96",
						"PricePerBook": "3.79",
						"ExDividendDate": "Oct 22",
						"PERatio": "24.87",
						"DividendPayDate": "Nov 17",
						"PERatioRealTime": "N/A",
						"PEGRatio": "2.62",
						"PricePerEPSEstimateCurrentYear": "20.99",
						"PricePerEPSEstimateNextYear": "19.42",
						"Symbol": "PG",
						"SharesOwned": "-",
						"Revenue": "83.024B",
						"ShortRatio": "3.80",
						"LastTradeTime": "4:02pm",
						"TickerTrend": " =====+ ",
						"_1YearTargetPrice": "91.65",
						"Volume": "7255494",
						"HoldingsValue": "-",
						"HoldingsValueRealTime": "N/A",
						"_52WeekRange": "75.26 - 93.89",
						"DaysValueChange": "- - -0.71%",
						"DaysValueChangeRealTime": "N/A - N/A",
						"StockExchange": "NYSE",
						"DividendYield": "2.78"
					}
				}
			}
		},
		getDividendHistoryForStock: [
			{
				'Symbol': constants.symbol,
				'Date': new Date(/*1417021200000*/"2014-11-26 12:00:00"),
				'Dividends': '0.305000'
			},
			{
				'Symbol': constants.symbol,
				'Date': new Date(/*1410451200000*/"2014-09-11 12:00:00"),
				'Dividends': '0.305000'
			}
		]
	};

	// Set up the module:
	beforeEach(module('stockWatcher'));

	beforeEach(inject(function($injector) {
		// Get objects to test:
		$q = $injector.get('$q');
		$httpBackend = $injector.get('$httpBackend');
		$timeout = $injector.get('$timeout');
		appConfig = $injector.get('appConfig');
		stockService = $injector.get('stockService');
		errorMessages = $injector.get('errorMessages');

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
	 * Unit Tests for "getHistoricalData()".
	 */
	describe('getHistoricalData', function() {
		it('should call the expected YQL URL and return the correctly-formatted data', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22" + constants.symbol + "%22%20and%20startDate%20%3D%20%22" + constants.startDate + "%22%20and%20endDate%20%3D%20%22" + constants.endDate + "%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getHistoricalData);

			var resultData = undefined;
			var resultDataPromise = stockService.getHistoricalData(constants.symbol, constants.startDate, constants.endDate);
			resultDataPromise.then(function (data) {
				resultData = data;
			})

			$httpBackend.flush();

			expect(resultData).toBeDefined();
			expect(resultData).toEqual(expectedResponses.getHistoricalData.query.results.quote);
		});

		it('should return a "NoData" Error Promise when receiving empty data array', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22" + constants.symbol + "%22%20and%20startDate%20%3D%20%22" + constants.startDate + "%22%20and%20endDate%20%3D%20%22" + constants.endDate + "%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getCurrentDataWithDetailsWithoutAnyResults);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getHistoricalData(constants.symbol, constants.startDate, constants.endDate);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$httpBackend.flush();

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.NoData.Error,
				message: errorMessages.NoData.Message
			});
		});
		
		it('should return a "Timeout" Error Promise when the request takes too long to respond', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22" + constants.symbol + "%22%20and%20startDate%20%3D%20%22" + constants.startDate + "%22%20and%20endDate%20%3D%20%22" + constants.endDate + "%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getCurrentDataWithDetailsWithoutAnyResults);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getHistoricalData(constants.symbol, constants.startDate, constants.endDate);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$timeout.flush(appConfig.JSONPTimeout + 1);

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.Timeout.Error,
				message: errorMessages.Timeout.Message.format(appConfig.JSONPTimeout)
			});
		});
	});







	/**
	 * Unit Tests for "getCurrentData()".
	 */
	describe('getCurrentData', function() {
		it('should call the expected YQL URL and return the correctly-formatted data', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20(%22" + constants.symbol + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getCurrentData);

			var resultData = undefined;
			var resultDataPromise = stockService.getCurrentData([constants.symbol]);
			resultDataPromise.then(function (data) {
				resultData = data;
			})

			$httpBackend.flush();

			expect(resultData).toBeDefined();
			expect(resultData).toEqual(expectedResponses.getCurrentData.query.results.quote);
		});

		it('should return a "NoData" Error Promise when receiving empty data array', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20(%22" + constants.symbol + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getCurrentDataWithDetailsWithoutAnyResults);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getCurrentData([constants.symbol]);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$httpBackend.flush();

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.NoData.Error,
				message: errorMessages.NoData.Message
			});
		});
		
		it('should return a "Timeout" Error Promise when the request takes too long to respond', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20(%22" + constants.symbol + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getCurrentDataWithDetailsWithoutAnyResults);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getCurrentData([constants.symbol]);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$timeout.flush(appConfig.JSONPTimeout + 1);

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.Timeout.Error,
				message: errorMessages.Timeout.Message.format(appConfig.JSONPTimeout)
			});
		});
	});







	/**
	 * Unit Tests for "getCurrentDataWithDetails()".
	 */
	describe('getCurrentDataWithDetails', function() {
		it('should call the expected YQL URL and return the correctly-formatted data', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D" + constants.symbol + "%26f%3Da0a2a5b0b2b3b4b6c0c1c3c4c6c8d0d1d2e0e1e7e8e9h0j0k0g0g1g3g4g5g6i0i5j0j1j3j4j5j6k0k1k2k4k5l0l1l2l3m0m2m3m4m5m6m7m8n0n4o0p0p1p2p5p6q0r0r1r2r5r6r7s0s1s6s7t1t7t8v0v1v7w0w1w4x0y0%26e%3D.csv'%20and%20columns%3D'Ask%2CAverageDailyVolume%2CAskSize%2CBid%2CAskRealTime%2CBidRealTime%2CBookValue%2CBidSize%2CChangeAndPercentChange%2CChange%2CCommission%2CCurrency%2CChangeRealTime%2CAfterHoursChangeRealTime%2CDividendPerShare%2CLastTradeDate%2CTradeDate%2CEarningsPerShare%2CErrorIndication%2CEPSEstimateCurrentYear%2CEPSEstimateNextYear%2CEPSEstimateNextQuarter%2CDaysHigh%2C_52WeekLow%2C_52WeekHigh%2CDaysLow%2CHoldingsGainPercent%2CAnnualizedGain%2CHoldingsGain%2CHoldingsGainPercentRealTime%2CHoldingsGainRealTime%2CMoreInfo%2COrderBookRealTime%2CYearLow%2CMarketCapitalization%2CMarketCapRealTime%2CEBITDA%2CChangeFrom52WeekLow%2CPercentChangeFrom52WeekLow%2CYearHigh%2CLastTradeRealTimeWithTime%2CChangePercentRealTime%2CChangeFrom52WeekHigh%2CPercentChangeFrom52WeekHigh%2CLastTradeWithTime%2CLastTradePriceOnly%2CHighLimit%2CLowLimit%2CDaysRange%2CDaysRangeRealTime%2C_50DayMovingAverage%2C_200DayMovingAverage%2CChangeFrom200DayMovingAverage%2CPercentChangeFrom200DayMovingAverage%2CChangeFrom50DayMovingAverage%2CPercentChangeFrom50DayMovingAverage%2CName%2CNotes%2COpen%2CPreviousClose%2CPricePaid%2CChangeInPercent%2CPricePerSales%2CPricePerBook%2CExDividendDate%2CPERatio%2CDividendPayDate%2CPERatioRealTime%2CPEGRatio%2CPricePerEPSEstimateCurrentYear%2CPricePerEPSEstimateNextYear%2CSymbol%2CSharesOwned%2CRevenue%2CShortRatio%2CLastTradeTime%2CTickerTrend%2C_1YearTargetPrice%2CVolume%2CHoldingsValue%2CHoldingsValueRealTime%2C_52WeekRange%2CDaysValueChange%2CDaysValueChangeRealTime%2CStockExchange%2CDividendYield'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getCurrentDataWithDetails);

			var resultData = undefined;
			var resultDataPromise = stockService.getCurrentDataWithDetails([constants.symbol]);
			resultDataPromise.then(function (data) {
				resultData = data;
			});

			$httpBackend.flush();

			expect(resultData).toBeDefined();
			expect(resultData).toEqual(formattedResponses.getCurrentDataWithDetails);
		});

		it('should return a "NoData" Error Promise when receiving empty data array', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D" + constants.symbol + "%26f%3Da0a2a5b0b2b3b4b6c0c1c3c4c6c8d0d1d2e0e1e7e8e9h0j0k0g0g1g3g4g5g6i0i5j0j1j3j4j5j6k0k1k2k4k5l0l1l2l3m0m2m3m4m5m6m7m8n0n4o0p0p1p2p5p6q0r0r1r2r5r6r7s0s1s6s7t1t7t8v0v1v7w0w1w4x0y0%26e%3D.csv'%20and%20columns%3D'Ask%2CAverageDailyVolume%2CAskSize%2CBid%2CAskRealTime%2CBidRealTime%2CBookValue%2CBidSize%2CChangeAndPercentChange%2CChange%2CCommission%2CCurrency%2CChangeRealTime%2CAfterHoursChangeRealTime%2CDividendPerShare%2CLastTradeDate%2CTradeDate%2CEarningsPerShare%2CErrorIndication%2CEPSEstimateCurrentYear%2CEPSEstimateNextYear%2CEPSEstimateNextQuarter%2CDaysHigh%2C_52WeekLow%2C_52WeekHigh%2CDaysLow%2CHoldingsGainPercent%2CAnnualizedGain%2CHoldingsGain%2CHoldingsGainPercentRealTime%2CHoldingsGainRealTime%2CMoreInfo%2COrderBookRealTime%2CYearLow%2CMarketCapitalization%2CMarketCapRealTime%2CEBITDA%2CChangeFrom52WeekLow%2CPercentChangeFrom52WeekLow%2CYearHigh%2CLastTradeRealTimeWithTime%2CChangePercentRealTime%2CChangeFrom52WeekHigh%2CPercentChangeFrom52WeekHigh%2CLastTradeWithTime%2CLastTradePriceOnly%2CHighLimit%2CLowLimit%2CDaysRange%2CDaysRangeRealTime%2C_50DayMovingAverage%2C_200DayMovingAverage%2CChangeFrom200DayMovingAverage%2CPercentChangeFrom200DayMovingAverage%2CChangeFrom50DayMovingAverage%2CPercentChangeFrom50DayMovingAverage%2CName%2CNotes%2COpen%2CPreviousClose%2CPricePaid%2CChangeInPercent%2CPricePerSales%2CPricePerBook%2CExDividendDate%2CPERatio%2CDividendPayDate%2CPERatioRealTime%2CPEGRatio%2CPricePerEPSEstimateCurrentYear%2CPricePerEPSEstimateNextYear%2CSymbol%2CSharesOwned%2CRevenue%2CShortRatio%2CLastTradeTime%2CTickerTrend%2C_1YearTargetPrice%2CVolume%2CHoldingsValue%2CHoldingsValueRealTime%2C_52WeekRange%2CDaysValueChange%2CDaysValueChangeRealTime%2CStockExchange%2CDividendYield'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getCurrentDataWithDetailsWithoutAnyResults);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getCurrentDataWithDetails([constants.symbol]);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$httpBackend.flush();

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.NoData.Error,
				message: errorMessages.NoData.Message
			});
		});
		
		it('should return a "Timeout" Error Promise when the request takes too long to respond', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D" + constants.symbol + "%26f%3Da0a2a5b0b2b3b4b6c0c1c3c4c6c8d0d1d2e0e1e7e8e9h0j0k0g0g1g3g4g5g6i0i5j0j1j3j4j5j6k0k1k2k4k5l0l1l2l3m0m2m3m4m5m6m7m8n0n4o0p0p1p2p5p6q0r0r1r2r5r6r7s0s1s6s7t1t7t8v0v1v7w0w1w4x0y0%26e%3D.csv'%20and%20columns%3D'Ask%2CAverageDailyVolume%2CAskSize%2CBid%2CAskRealTime%2CBidRealTime%2CBookValue%2CBidSize%2CChangeAndPercentChange%2CChange%2CCommission%2CCurrency%2CChangeRealTime%2CAfterHoursChangeRealTime%2CDividendPerShare%2CLastTradeDate%2CTradeDate%2CEarningsPerShare%2CErrorIndication%2CEPSEstimateCurrentYear%2CEPSEstimateNextYear%2CEPSEstimateNextQuarter%2CDaysHigh%2C_52WeekLow%2C_52WeekHigh%2CDaysLow%2CHoldingsGainPercent%2CAnnualizedGain%2CHoldingsGain%2CHoldingsGainPercentRealTime%2CHoldingsGainRealTime%2CMoreInfo%2COrderBookRealTime%2CYearLow%2CMarketCapitalization%2CMarketCapRealTime%2CEBITDA%2CChangeFrom52WeekLow%2CPercentChangeFrom52WeekLow%2CYearHigh%2CLastTradeRealTimeWithTime%2CChangePercentRealTime%2CChangeFrom52WeekHigh%2CPercentChangeFrom52WeekHigh%2CLastTradeWithTime%2CLastTradePriceOnly%2CHighLimit%2CLowLimit%2CDaysRange%2CDaysRangeRealTime%2C_50DayMovingAverage%2C_200DayMovingAverage%2CChangeFrom200DayMovingAverage%2CPercentChangeFrom200DayMovingAverage%2CChangeFrom50DayMovingAverage%2CPercentChangeFrom50DayMovingAverage%2CName%2CNotes%2COpen%2CPreviousClose%2CPricePaid%2CChangeInPercent%2CPricePerSales%2CPricePerBook%2CExDividendDate%2CPERatio%2CDividendPayDate%2CPERatioRealTime%2CPEGRatio%2CPricePerEPSEstimateCurrentYear%2CPricePerEPSEstimateNextYear%2CSymbol%2CSharesOwned%2CRevenue%2CShortRatio%2CLastTradeTime%2CTickerTrend%2C_1YearTargetPrice%2CVolume%2CHoldingsValue%2CHoldingsValueRealTime%2C_52WeekRange%2CDaysValueChange%2CDaysValueChangeRealTime%2CStockExchange%2CDividendYield'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getCurrentDataWithDetailsWithoutAnyResults);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getCurrentDataWithDetails([constants.symbol]);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$timeout.flush(appConfig.JSONPTimeout + 1);

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.Timeout.Error,
				message: errorMessages.Timeout.Message.format(appConfig.JSONPTimeout)
			});
		});
	});







	/**
	 * Unit Tests for "getLiveData()".
	 */
	describe('getLiveData', function() {
		it('should call the expected YQL URL and return the correctly-formatted data', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20csv%20WHERE%20url%3D%22http%3A%2F%2Fwww.google.com%2Ffinance%2Fgetprices%3Fq%3D" + constants.symbol + "%26x%3D" + constants.exchange + "%26i%3D" + constants.interval + "%26p%3D" + constants.period + "%26f%3Dd%2Cc%2Cv%2Ck%2Co%2Ch%2Cl%26df%3Dcpct%26auto%3D0%26ei%3DEf6XUYDfCqSTiAKEMg%22&format=json&callback=JSON_CALLBACK")
				.respond(expectedResponses.getLiveData);

			var resultData = undefined;
			var resultDataPromise = stockService.getLiveData(constants.symbol, constants.exchange, constants.interval, constants.period);
			resultDataPromise.then(function (data) {
				resultData = data;
			});

			$httpBackend.flush();

			expect(resultData).toBeDefined();
			expect(resultData).toEqual(formattedResponses.getLiveData);
		});

		it('should return a "NoData" Error Promise when receiving empty data array', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20csv%20WHERE%20url%3D%22http%3A%2F%2Fwww.google.com%2Ffinance%2Fgetprices%3Fq%3D" + constants.symbol + "%26x%3D" + constants.exchange + "%26i%3D" + constants.interval + "%26p%3D" + constants.period + "%26f%3Dd%2Cc%2Cv%2Ck%2Co%2Ch%2Cl%26df%3Dcpct%26auto%3D0%26ei%3DEf6XUYDfCqSTiAKEMg%22&format=json&callback=JSON_CALLBACK")
				.respond(expectedResponses.getDataWithoutAnyResults);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getLiveData(constants.symbol, constants.exchange, constants.interval, constants.period);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$httpBackend.flush();

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.NoData.Error,
				message: errorMessages.NoData.Message
			});
		});
		
		it('should return a "Timeout" Error Promise when the request takes too long to respond', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20csv%20WHERE%20url%3D%22http%3A%2F%2Fwww.google.com%2Ffinance%2Fgetprices%3Fq%3D" + constants.symbol + "%26x%3D" + constants.exchange + "%26i%3D" + constants.interval + "%26p%3D" + constants.period + "%26f%3Dd%2Cc%2Cv%2Ck%2Co%2Ch%2Cl%26df%3Dcpct%26auto%3D0%26ei%3DEf6XUYDfCqSTiAKEMg%22&format=json&callback=JSON_CALLBACK")
				.respond(expectedResponses.getDataWithoutAnyResults);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getLiveData(constants.symbol, constants.exchange, constants.interval, constants.period);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$timeout.flush(appConfig.JSONPTimeout + 1);

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.Timeout.Error,
				message: errorMessages.Timeout.Message.format(appConfig.JSONPTimeout)
			});
		});
	});







	/** 
	 * Unit Tests for "getLiveMarketData()".
	 */
	describe('getLiveMarketData', function() {
		it('should call the expected YQL URL and return the correctly-formatted data', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20csv%20WHERE%20url%3D%22http%3A%2F%2Fwww.google.com%2Ffinance%2Fgetprices%3Fq%3D" + constants.marketSymbol + "%26i%3D" + constants.interval + "%26p%3D" + constants.period + "%26f%3Dd%2Cc%2Cv%2Ck%2Co%2Ch%2Cl%26df%3Dcpct%26auto%3D0%26ei%3DEf6XUYDfCqSTiAKEMg%22&format=json&callback=JSON_CALLBACK")
				.respond(expectedResponses.getLiveMarketData);

			var resultData = undefined;
			var resultDataPromise = stockService.getLiveMarketData(constants.marketSymbol, constants.interval, constants.period);
			resultDataPromise.then(function (data) {
				resultData = data;
			});

			$httpBackend.flush();

			expect(resultData).toBeDefined();
			expect(resultData).toEqual(formattedResponses.getLiveMarketData);
		});

		it('should return a "NoData" Error Promise when receiving empty data array', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20csv%20WHERE%20url%3D%22http%3A%2F%2Fwww.google.com%2Ffinance%2Fgetprices%3Fq%3D" + constants.marketSymbol + "%26i%3D" + constants.interval + "%26p%3D" + constants.period + "%26f%3Dd%2Cc%2Cv%2Ck%2Co%2Ch%2Cl%26df%3Dcpct%26auto%3D0%26ei%3DEf6XUYDfCqSTiAKEMg%22&format=json&callback=JSON_CALLBACK")
				.respond(expectedResponses.getDataWithoutAnyResults);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getLiveMarketData(constants.marketSymbol, constants.interval, constants.period);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$httpBackend.flush();

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.NoData.Error,
				message: errorMessages.NoData.Message
			});
		});
		
		it('should return a "Timeout" Error Promise when the request takes too long to respond', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20csv%20WHERE%20url%3D%22http%3A%2F%2Fwww.google.com%2Ffinance%2Fgetprices%3Fq%3D" + constants.marketSymbol + "%26i%3D" + constants.interval + "%26p%3D" + constants.period + "%26f%3Dd%2Cc%2Cv%2Ck%2Co%2Ch%2Cl%26df%3Dcpct%26auto%3D0%26ei%3DEf6XUYDfCqSTiAKEMg%22&format=json&callback=JSON_CALLBACK")
				.respond(expectedResponses.getDataWithoutAnyResults);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getLiveMarketData(constants.marketSymbol, constants.interval, constants.period);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$timeout.flush(appConfig.JSONPTimeout + 1);

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.Timeout.Error,
				message: errorMessages.Timeout.Message.format(appConfig.JSONPTimeout)
			});
		});
	});







	/** 
	 * Unit Tests for "getNewsFeedForStock()".
	 */
	describe('getNewsFeedForStock', function() {
		it('should call the expected YQL URL and return the correctly-formatted data', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feed%20where%20url%3D'http%3A%2F%2Ffeeds.finance.yahoo.com%2Frss%2F2.0%2Fheadline%3Fs%3D" + constants.marketSymbol + "%26region%3DCA'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getNewsFeedForStock);
        	
			var resultData = undefined;
			var resultDataPromise = stockService.getNewsFeedForStock(constants.marketSymbol, constants.interval, constants.period);
			resultDataPromise.then(function (data) {
				resultData = data;
			});

			$httpBackend.flush();

			expect(resultData).toBeDefined();
			expect(resultData).toEqual(expectedResponses.getNewsFeedForStock.query.results.item);
		});

		it('should return a "NoData" Error Promise when receiving empty data array', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feed%20where%20url%3D'http%3A%2F%2Ffeeds.finance.yahoo.com%2Frss%2F2.0%2Fheadline%3Fs%3D" + constants.marketSymbol + "%26region%3DCA'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getDataWithoutAnyResults);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getNewsFeedForStock(constants.marketSymbol, constants.interval, constants.period);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$httpBackend.flush();

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.NoData.Error,
				message: errorMessages.NoData.Message
			});
		});
		
		it('should return a "Timeout" Error Promise when the request takes too long to respond', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feed%20where%20url%3D'http%3A%2F%2Ffeeds.finance.yahoo.com%2Frss%2F2.0%2Fheadline%3Fs%3D" + constants.marketSymbol + "%26region%3DCA'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getDataWithoutAnyResults);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getNewsFeedForStock(constants.marketSymbol, constants.interval, constants.period);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$timeout.flush(appConfig.JSONPTimeout + 1);

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.Timeout.Error,
				message: errorMessages.Timeout.Message.format(appConfig.JSONPTimeout)
			});
		});

		it('should return a "YQLError" Error Promise when sending a request with a syntax error', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feed%20where%20url%3D'http%3A%2F%2Ffeeds.finance.yahoo.com%2Frss%2F2.0%2Fheadline%3Fs%3D" + constants.marketSymbol + "%26region%3DCA'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getDataWithYQLError);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getNewsFeedForStock(constants.marketSymbol, constants.interval, constants.period);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$httpBackend.flush();

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.YQL.Error,
				message: errorMessages.YQL.Message,
				data: 'YQLError'
			});
		});
	});







	/** 
	 * Unit Tests for "getDividendHistoryForStock()".
	 */
	describe('getDividendHistoryForStock', function() {
		it('should call the expected YQL URL and return the correctly-formatted data', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.dividendhistory%20where%20symbol%20%3D%20%22" + constants.symbol + "%22%20and%20startDate%20%3D%20%22" + constants.startDate + "%22%20and%20endDate%20%3D%20%22" + constants.endDate + "%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getDividendHistoryForStock);

			var resultData = undefined;
			var resultDataPromise = stockService.getDividendHistoryForStock(constants.symbol, constants.startDate, constants.endDate);
			resultDataPromise.then(function (data) {
				resultData = data;
			});

			$httpBackend.flush();

			expect(resultData).toBeDefined();
			expect(resultData).toEqual(formattedResponses.getDividendHistoryForStock);
		});

		it('should return a "NoData" Error Promise when receiving empty data array', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.dividendhistory%20where%20symbol%20%3D%20%22" + constants.symbol + "%22%20and%20startDate%20%3D%20%22" + constants.startDate + "%22%20and%20endDate%20%3D%20%22" + constants.endDate + "%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getDataWithoutAnyResults);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getDividendHistoryForStock(constants.symbol, constants.startDate, constants.endDate);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$httpBackend.flush();

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.NoData.Error,
				message: errorMessages.NoData.Message
			});
		});
		
		it('should return a "Timeout" Error Promise when the request takes too long to respond', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.dividendhistory%20where%20symbol%20%3D%20%22" + constants.symbol + "%22%20and%20startDate%20%3D%20%22" + constants.startDate + "%22%20and%20endDate%20%3D%20%22" + constants.endDate + "%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getDataWithoutAnyResults);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getDividendHistoryForStock(constants.symbol, constants.startDate, constants.endDate);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$timeout.flush(appConfig.JSONPTimeout + 1);

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.Timeout.Error,
				message: errorMessages.Timeout.Message.format(appConfig.JSONPTimeout)
			});
		});

		it('should return a "YQLError" Error Promise when sending a request with a syntax error', function() {
			$httpBackend
				.expectJSONP("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.dividendhistory%20where%20symbol%20%3D%20%22" + constants.symbol + "%22%20and%20startDate%20%3D%20%22" + constants.startDate + "%22%20and%20endDate%20%3D%20%22" + constants.endDate + "%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")
				.respond(expectedResponses.getDataWithYQLError);

			var resultData = undefined;
			var errorCallbackFired = false;
			var errorCallbackReason = undefined;
			var resultDataPromise = stockService.getDividendHistoryForStock(constants.symbol, constants.startDate, constants.endDate);
			resultDataPromise.then(
				function (data) {
					resultData = data;
				},
				function (reason) {
					errorCallbackFired = true;
					errorCallbackReason = reason;
				}
			);

			$httpBackend.flush();

			expect(resultData).toBeUndefined();
			expect(errorCallbackFired).toBeTruthy();
			expect(errorCallbackReason).toBeDefined();
			expect(errorCallbackReason).toEqual({
				error: errorMessages.YQL.Error,
				message: errorMessages.YQL.Message,
				data: 'YQLError'
			});
		});
	});
});
