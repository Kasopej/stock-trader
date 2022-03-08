const prices = [
  {
    language: "en-US",
    region: "US",
    quoteType: "EQUITY",
    quoteSourceName: "Nasdaq Real Time Price",
    triggerable: true,
    customPriceAlertConfidence: "HIGH",
    currency: "USD",
    gmtOffSetMilliseconds: -18000000,
    esgPopulated: false,
    exchange: "NMS",
    shortName: "Apple Inc.",
    longName: "Apple Inc.",
    messageBoardId: "finmb_24937",
    exchangeTimezoneName: "America/New_York",
    exchangeTimezoneShortName: "EST",
    market: "us_market",
    marketState: "PREPRE",
    financialCurrency: "USD",
    regularMarketOpen: 164.49,
    averageDailyVolume3Month: 98047305,
    averageDailyVolume10Day: 90105960,
    fiftyTwoWeekLowChange: 46.96,
    fiftyTwoWeekLowChangePercent: 0.40409604,
    fiftyTwoWeekRange: "116.21 - 182.94",
    fiftyTwoWeekHighChange: -19.770004,
    fiftyTwoWeekHighChangePercent: -0.10806824,
    fiftyTwoWeekLow: 116.21,
    fiftyTwoWeekHigh: 182.94,
    dividendDate: 1644451200,
    earningsTimestamp: 1643301000,
    earningsTimestampStart: 1651003200,
    earningsTimestampEnd: 1651521600,
    trailingAnnualDividendRate: 0.865,
    trailingPE: 27.127182,
    trailingAnnualDividendYield: 0.0052036336,
    epsTrailingTwelveMonths: 6.015,
    epsForward: 6.57,
    epsCurrentYear: 6.16,
    priceEpsCurrentYear: 26.488636,
    sharesOutstanding: 16319399936,
    bookValue: 4.402,
    fiftyDayAverage: 170.7934,
    fiftyDayAverageChange: -7.623398,
    fiftyDayAverageChangePercent: -0.044635203,
    twoHundredDayAverage: 152.61945,
    twoHundredDayAverageChange: 10.550552,
    twoHundredDayAverageChangePercent: 0.0691298,
    marketCap: 2662836469760,
    forwardPE: 24.835615,
    priceToBook: 37.06724,
    sourceInterval: 15,
    exchangeDataDelayedBy: 0,
    pageViewGrowthWeekly: -0.07481377,
    averageAnalystRating: "1.8 - Buy",
    tradeable: false,
    firstTradeDateMilliseconds: 345479400000,
    priceHint: 2,
    postMarketChangePercent: -0.116444,
    postMarketTime: 1646441994,
    postMarketPrice: 162.98,
    postMarketChange: -0.190002,
    regularMarketChange: -3.0599976,
    regularMarketChangePercent: -1.8408215,
    regularMarketTime: 1646427603,
    regularMarketPrice: 163.17,
    regularMarketDayHigh: 165.55,
    regularMarketDayRange: "162.11 - 165.55",
    regularMarketDayLow: 162.11,
    regularMarketVolume: 83819592,
    regularMarketPreviousClose: 166.23,
    bid: 0,
    ask: 0,
    bidSize: 11,
    askSize: 9,
    fullExchangeName: "NasdaqGS",
    displayName: "Apple",
    symbol: "AAPL",
  },
];
for (let index = 1; index < 50; index++) {
  prices[index] = prices[0];
}
export { prices };