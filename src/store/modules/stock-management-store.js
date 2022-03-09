/* eslint-disable no-unused-vars */
import { axiosStocksInstance } from "../../services/network-services/axios-stocks";
const state = {
  shares: [],
  portfolio: [],
};

const getters = {
  areAllSharesPricesAvailable(state) {
    return !state.shares.find((share) => !("currentPrice" in share));
  },
  portfolioValue(state) {
    return state.portfolio.reduce(
      (value, asset) =>
        value + asset.assetDetails.currentPrice * asset.quantity,
      0
    );
  },
  bestPerformingAsset(state) {
    let highestGrowthRate = -1_000_000_000;
    let bestPerformingAssetIndex;
    state.portfolio.forEach((asset, index) => {
      if (asset.assetDetails.priceChange > highestGrowthRate) {
        highestGrowthRate = asset.assetDetails.priceChange;
        bestPerformingAssetIndex = index;
      }
    });
    if (highestGrowthRate > -1_000_000_000)
      return state.portfolio[bestPerformingAssetIndex];
    else
      return {
        assetDetails: { ticker: "no assets", priceChange: 0 },
        quantity: 0,
      };
  },
  worstPerformingAsset(state) {
    let lowestGrowthRate = 1_000_000_000;
    let worstPerformingAssetIndex;
    state.portfolio.forEach((asset, index) => {
      if (asset.assetDetails.priceChange < lowestGrowthRate) {
        lowestGrowthRate = asset.assetDetails.priceChange;
        worstPerformingAssetIndex = index;
      }
    });
    if (lowestGrowthRate < 1_000_000_000)
      return state.portfolio[worstPerformingAssetIndex];
    else
      return {
        assetDetails: { ticker: "no assets", priceChange: 0 },
        quantity: 0,
      };
  },
  netGrowth(state, getters) {
    try {
      let basePortfolioValue = state.portfolio.reduce((value, asset) => {
        if ("historicalPrice" in asset)
          return value + asset.historicalPrice * asset.quantity;
        else throw Error("historical price not set on asset");
      }, 0);
      return getters.portfolioValue - basePortfolioValue;
    } catch (error) {
      console.log(error);
      return 0;
    }
  },
};

const actions = {
  /*
  getSymbolsFromMarket({ state, commit, dispatch }) {
    axiosStocksInstance
      .get(
        "v3/search-ticker?query=&limit=5&exchange=NASDAQ&apikey=92f991cbed3c4ac053149578277389e5"
      )
      .then((res) => {
        const data = res.data;
        console.log(data);
        commit("setSharesSymbols", data);
        const arrayOfSymbols = data.map((element) => {
          return element.symbol;
        });
        for (const asset of state.portfolio) {
          if (arrayOfSymbols.includes(asset.symbol)) {
            axiosStocksInstance
              .get(
                `v3/search-ticker?query=${asset.symbol}&limit=10&exchange=NASDAQ&apikey=92f991cbed3c4ac053149578277389e5`
              )
              .then((res) => {
                if (res.data.length === 1) {
                  commit("addMissingSymbolsToShares", res.data);
                } else {
                  throw new Error(
                    "asset not found in stock market! Kindly send us a mail"
                  );
                }
              })
              .catch((error) => console.log(error));
          }
        }
      })
      .finally(() => {
        dispatch("getHistoricalRangeOfPricesOfShares");
      });
  },
  */
  getSymbolsFromMarket({ commit, dispatch, state }) {
    axiosStocksInstance
      .get("", {
        baseURL:
          "https://api.polygon.io/v3/reference/tickers?market=stocks&exchange=XNAS&active=true&sort=ticker&order=asc&limit=50&apiKey=YtTjMC3PISJ78qtZOK7W2zGcTsNfpK9x",
      })
      .then((res) => {
        const data = res.data.results;
        commit("setSharesData", data);
        const arrayOfSymbols = state.shares.map((element) => {
          return element.ticker;
        });
        return arrayOfSymbols;
      })
      .then((symbols) => {
        dispatch("getPriceDataForShares", symbols);
      });
    setTimeout(() => {
      dispatch("getSymbolsFromMarket");
    }, 43200000);
  },
  getPriceDataForShares({ commit, dispatch }, symbols) {
    let start = 0;
    let end = 10;
    const priceDataArray = [];
    let endInterval;
    let interval = setInterval(() => {
      let queryURLForTenShares = symbols.slice(start, end).join("%2C");
      console.log(queryURLForTenShares);
      axiosStocksInstance
        .get("", {
          baseURL: `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${queryURLForTenShares}`,
          headers: {
            "X-API-KEY": "pYMadBtrXJ63bgaGeALZW7IJjzNjpZll25ESNoLV",
            accept: "application/json",
          },
        })
        .then((res) => {
          console.log("pricesss");
          console.log(res.data.quoteResponse.result);
          priceDataArray.splice(
            priceDataArray.length,
            0,
            ...res.data.quoteResponse.result
          );
          console.log(priceDataArray);
          if (endInterval) {
            console.log("clearing");
            clearInterval(interval);
            commit("setSharePrices", priceDataArray);
            dispatch("getHistoricalPriceDataForAssets");
          }
        });
      start += 10;
      end += 10;
      if (start >= symbols.length) {
        endInterval = true;
      }
      console.log(start, end);
    }, 30000);
  },
  updatePortfolioFromStock({ commit, state, dispatch }, payload) {
    console.log("updating portfolio from stock market");
    const assetToUpdate = state.portfolio.find(
      (asset) => payload.stock.ticker === asset.assetDetails.ticker
    );
    if (assetToUpdate) {
      commit("updatePortfolioAssetAmount", {
        asset: assetToUpdate,
        quantity: payload.quantity,
      });
    } else {
      commit("createPortfolioAsset", {
        asset: payload.stock,
        quantity: payload.quantity,
      });
    }
    return dispatch(
      "updateUserAccount",
      {
        portfolio: state.portfolio,
      },
      { root: true }
    );
  },
  updatePortfolioFromAsset({ commit, dispatch, rootState }, payload) {
    console.log("portfolio from asset", JSON.stringify(payload));
    commit("updatePortfolioAssetAmount", {
      asset: payload.asset,
      quantity: payload.quantity,
    });
    return dispatch(
      "updateUserAccount",
      {
        portfolio: rootState.accountMangementModule.account.portfolio,
      },
      { root: true }
    );
  },
  getHistoricalPriceDataForAssets({ state, commit }) {
    let index = 0;
    const priceDataArray = [];
    let endInterval;
    let interval = setInterval(() => {
      console.log("getting historical update");
      axiosStocksInstance
        .get("", {
          baseURL: `https://financialmodelingprep.com/api/v3/historical-price-full/${state.portfolio[index].assetDetails.ticker}?from=2019-03-12&to=2019-03-12&apikey=92f991cbed3c4ac053149578277389e5`,
        })
        .then((res) => {
          console.log("historical update", res.data);
          try {
            priceDataArray.splice(
              priceDataArray.length,
              0,
              res.data.historical[0].close
            );
            throw new Error("no historical data found in database");
          } catch (error) {
            priceDataArray.splice(priceDataArray.length, 0, 0);
          }
          console.log(priceDataArray);
          if (endInterval) {
            console.log("clearing historical");
            clearInterval(interval);
            commit("setHistoricalPricesOnAssets", priceDataArray);
          }
        });
      index++;
      if (index === state.portfolio.length) {
        endInterval = true;
      }
    }, 30000);
  },
};

const mutations = {
  setSharesData(state, payload) {
    state.shares.splice(0, state.shares.length, ...payload);
  },
  addMissingSymbolsToShares(state, payload) {
    state.shares.splice(state.shares.length - 1, 0, payload[0]);
    state.shares.sort((a, b) => {
      return a.ticker < b.ticker ? -1 : 1;
    });
  },
  setSharePrices(state, payload) {
    state.shares.forEach((share, index) => {
      share.currentPrice = payload[index].regularMarketPrice;
      share.priceChange = payload[index].regularMarketChangePercent;
    });
  },
  updatePortfolioAssetAmount(state, payload) {
    /* eslint-disable no-unused-vars */
    console.log("updated asset", JSON.stringify(payload));
    payload.asset.quantity += payload.quantity;
    console.log("fully updated asset", JSON.stringify(payload));
  },
  createPortfolioAsset(state, payload) {
    state.portfolio.push({
      assetDetails: payload.asset,
      quantity: payload.quantity,
    });
  },
  setHistoricalPricesOnAssets(state, historicalPriceArray) {
    state.shares.forEach(
      (asset, index) =>
        (asset = Object.assign({}, asset, {
          historicalPrice: historicalPriceArray[index],
        }))
    );
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
