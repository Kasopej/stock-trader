import axios from "axios";

let stockMangementModule, ctx;
describe("stock-management-store is a store module that manages stocks and all stock transactions", function () {
  beforeEach(async () => {
    stockMangementModule = (
      await import("../../../../src/store/modules/stock-management-store.js")
    ).default;
    ctx = {
      dispatch: jest.fn(),
      commit: jest.fn(),
      state: {
        shares: [],
        portfolio: [],
      },
      rootState: {
        authStoreModule: { idToken: "qwertyuio" },
        accountMangementModule: {},
      },
    };
  });
  afterEach(() => {
    stockMangementModule.state = {
      shares: [],
      portfolio: [],
    };
    jest.useRealTimers();
    jest.resetAllMocks();
  });
  /* This section of test cases covers getters */
  it("has a areAllSharesPricesAvailable getter which returns true if all market stocks have a currentPrice property set, if not it returns false", () => {
    expect(
      stockMangementModule.getters.areAllSharesPricesAvailable(
        stockMangementModule.state
      )
    ).toBe(false);
  });
  it("has a areAllSharesPricesAvailable getter which returns true if all market stocks have a currentPrice property set, if not it returns false", () => {
    stockMangementModule.state.shares.push(
      { ticker: "AAPL", currentPrice: 340 },
      { ticker: "GOOG", currentPrice: 423 }
    );
    expect(
      stockMangementModule.getters.areAllSharesPricesAvailable(
        stockMangementModule.state
      )
    ).toBe(true);
  });
  it("has a areAllSharesPricesAvailable getter which returns true if all market stocks have a currentPrice property set, if not it returns false", () => {
    stockMangementModule.state.shares.push(
      { ticker: "AAPL", currentPrice: 340 },
      {
        ticker: "GOOG", //no currentPrice property set
      }
    );
    expect(
      stockMangementModule.getters.areAllSharesPricesAvailable(
        stockMangementModule.state
      )
    ).toBe(false);
  });
  it("has a portfolioValue getter which calculates the value of all shares in the portfolio", () => {
    stockMangementModule.state.portfolio.push(
      { assetDetails: { ticker: "AAPL", currentPrice: 340 }, quantity: 10 },
      { assetDetails: { ticker: "GOOG", currentPrice: 421 }, quantity: 10 }
    );
    expect(
      stockMangementModule.getters.portfolioValue(stockMangementModule.state)
    ).toBe(7610);
  });
  it("has a portfolioValue getter which calculates the value of all shares in the portfolio", () => {
    stockMangementModule.state.portfolio.push(
      { assetDetails: { ticker: "AAPL", currentPrice: 340 }, quantity: 10 },
      { assetDetails: { ticker: "GOOG" }, quantity: 10 } //no currentPrice set
    );
    expect(
      stockMangementModule.getters.portfolioValue(stockMangementModule.state)
    ).toBeNaN();
  });
  it("has a bestPerformingAsset getter which finds the portfolio share with the best growth rate (priceChange). The lower limit for comparison is -1,000,000%", () => {
    stockMangementModule.state.portfolio.push(
      { assetDetails: { ticker: "AAPL", priceChange: 5.05 }, quantity: 10 },
      { assetDetails: { ticker: "GOOG", priceChange: 2.4 }, quantity: 10 }
    );
    expect(
      stockMangementModule.getters.bestPerformingAsset(
        stockMangementModule.state
      )
    ).toEqual(
      expect.objectContaining({
        assetDetails: { ticker: "AAPL", priceChange: 5.05 },
      })
    );
  });
  it("has a bestPerformingAsset getter which finds the portfolio share with the best growth rate (priceChange). The lower limit for comparison is -1,000,000%. If no best portfolio asset is found, it returns a dummy share object for display", () => {
    expect(
      stockMangementModule.getters.bestPerformingAsset(
        stockMangementModule.state
      )
    ).toEqual(
      expect.objectContaining({
        assetDetails: { ticker: "", priceChange: 0 },
      })
    );
  });
  it("has a worstPerformingAsset getter which finds the portfolio share with the best growth rate (priceChange). The lower limit for comparison is -1,000,000%", () => {
    stockMangementModule.state.portfolio.push(
      { assetDetails: { ticker: "AAPL", priceChange: 5.05 }, quantity: 10 },
      { assetDetails: { ticker: "GOOG", priceChange: 2.4 }, quantity: 10 }
    );
    expect(
      stockMangementModule.getters.worstPerformingAsset(
        stockMangementModule.state
      )
    ).toEqual(
      expect.objectContaining({
        assetDetails: { ticker: "GOOG", priceChange: 2.4 },
      })
    );
  });
  it("has a worstPerformingAsset getter which finds the portfolio share with the best growth rate (priceChange). The lower limit for comparison is -1,000,000%. If no best portfolio asset is found, it returns a dummy share object for display", () => {
    expect(
      stockMangementModule.getters.worstPerformingAsset(
        stockMangementModule.state
      )
    ).toEqual(
      expect.objectContaining({
        assetDetails: { ticker: "", priceChange: 0 },
      })
    );
  });
  /* This section of test cases covers actions */
  it("has a getSymbolsFromMarket action that fetches stock info data from the financial market API, sets them in the application store, and then dispatches an action to fetch price data from another financial market API", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        results: [
          { ticker: "AAPL", exchange: "Nasdaq" },
          { ticker: "GOOG", exchange: "Nasdaq" },
        ],
      },
    });
    ctx.state.shares.push(
      { ticker: "AAPL", exchange: "Nasdaq" },
      { ticker: "GOOG", exchange: "Nasdaq" }
    );
    await stockMangementModule.actions.getSymbolsFromMarket(ctx);
    expect(ctx.commit).toHaveBeenCalledTimes(1);
    expect(ctx.dispatch).toHaveBeenCalledTimes(1);
  });
  it("has a getPriceDataForShares action that fetches stock price data for an array of share tickers from the financial market API, sets them in the application store on both market stocks and portfolio shares", async () => {
    jest.useFakeTimers();
    axios.get.mockResolvedValueOnce({
      data: {
        quoteResponse: {
          result: [
            { regularMarketPrice: 210, regularMarketChangePercent: 2.3 },
            { regularMarketPrice: 400, regularMarketChangePercent: 1.2 },
          ],
        },
      },
    });
    await stockMangementModule.actions.getPriceDataForShares(ctx, [
      "AAPL",
      "GOOG",
    ]);
    jest.advanceTimersByTime(20000);
    await new Promise(process.nextTick);
    expect(ctx.commit).toHaveBeenCalledTimes(2);
    expect(ctx.dispatch).toHaveBeenCalledTimes(1);
  });
  it("has a updatePortfolioFromStock action that updates the portfolio array when a transaction is carried out on a market stock.If the company stock being purchased is not in the portfolio, it commits a mutation to create a new portfolio share asset in the portfolio", () => {
    ctx.state.portfolio.push(
      { assetDetails: { ticker: "AAPL" }, quantity: 5 },
      { assetDetails: { ticker: "GOOG" }, quantity: 10 }
    );
    stockMangementModule.actions.updatePortfolioFromStock(ctx, {
      stock: { ticker: "EBAY" },
      quantity: 5,
    });
    expect(ctx.commit.mock.calls[0][0]).toBe("createPortfolioAsset");
    expect(ctx.dispatch.mock.calls[0][0]).toBe("updateUserAccount");
  });
  it("has a updatePortfolioFromStock action that updates the portfolio array when a transaction is carried out on a market stock.If the company stock being purchased is currently in the portfolio, it commits a mutation to edit that asset", () => {
    ctx.state.portfolio.push(
      { assetDetails: { ticker: "AAPL" }, quantity: 5 },
      { assetDetails: { ticker: "GOOG" }, quantity: 10 }
    );
    stockMangementModule.actions.updatePortfolioFromStock(ctx, {
      stock: { ticker: "AAPL" },
      quantity: 5,
    });
    expect(ctx.commit.mock.calls[0][0]).toBe("updatePortfolioAssetAmount");
    expect(ctx.dispatch.mock.calls[0][0]).toBe("updateUserAccount");
  });
});
