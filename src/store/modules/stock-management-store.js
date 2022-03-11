/* eslint-disable no-unused-vars */
import dayjs from "dayjs";
import { axiosStocksInstance } from "../../services/network-services/axios-stocks";
const state = {
  shares: [],
  portfolio: [],
};

const getters = {
  areAllSharesPricesAvailable(state) {
    return state.shares.length
      ? !state.shares.find((share) => !("currentPrice" in share))
      : false;
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
        assetDetails: { ticker: "", priceChange: 0 },
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
        assetDetails: { ticker: "", priceChange: 0 },
        quantity: 0,
      };
  },
};

const actions = {
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
  getPriceDataForShares({ commit, dispatch, state }, symbols) {
    let start = 0;
    let end = 10;
    const priceDataArray = [];
    let endInterval;
    let interval = setInterval(() => {
      let queryURLForTenShares = symbols.slice(start, end).join("%2C");
      axiosStocksInstance
        .get("", {
          baseURL: `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${queryURLForTenShares}`,
          headers: {
            "X-API-KEY": "JFNit9EO3wadKcooQXZVu85ZyzXFAMqd2dDYb89e",
            accept: "application/json",
          },
        })
        .then((res) => {
          priceDataArray.splice(
            priceDataArray.length,
            0,
            ...res.data.quoteResponse.result
          );
          console.log(priceDataArray);
          if (endInterval) {
            commit("setSharePrices", priceDataArray);
            commit("updateAssetsPriceDataFromFetchedStocksData", state.shares);
            //let dateString = new Date().toISOString();
            let lastFridayDate = dayjs()
              .day(5)
              .subtract(7, "d")
              .format("YYYY-MM-DD");
            dispatch("getHistoricalPriceDataForAssets", lastFridayDate);
          }
        });
      start += 10;
      end += 10;
      if (start === symbols.length) {
        endInterval = true;
        clearInterval(interval);
      }
    }, 20000);
  },
  updatePortfolioFromStock({ commit, state, dispatch }, payload) {
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
  updatePortfolioFromAsset({ commit, dispatch, state }, payload) {
    commit("updatePortfolioAssetAmount", {
      asset: payload.asset,
      quantity: payload.quantity,
    });
    return dispatch(
      "updateUserAccount",
      {
        portfolio: state.portfolio,
      },
      { root: true }
    );
  },
  getHistoricalPriceDataForAssets({ state, dispatch, commit }, payload) {
    let index = 0;
    const priceDataArray = [];
    let endInterval;
    if (state.portfolio.length) {
      let interval = setInterval(() => {
        if (index === state.portfolio.length - 1) {
          endInterval = true;
          clearInterval(interval);
        }
        axiosStocksInstance
          .get("", {
            baseURL: `https://financialmodelingprep.com/api/v3/historical-price-full/${state.portfolio[index].assetDetails.ticker}?from=${payload}&to=${payload}&apikey=92f991cbed3c4ac053149578277389e5`,
          })
          .then((res) => {
            try {
              priceDataArray.splice(
                priceDataArray.length,
                0,
                res.data.historical[0].close
              );
            } catch (error) {
              priceDataArray.splice(priceDataArray.length, 0, 0);
            }
            console.log(priceDataArray);
            if (endInterval) {
              commit("setHistoricalPricesOnAssets", priceDataArray);
              dispatch(
                "updateUserAccount",
                {
                  portfolio: state.portfolio,
                },
                { root: true }
              );
            }
          });
        index++;
      }, 20000);
    }
  },
  calculateProfitFromPortfolio({
    state,
    rootState,
    getters,
    commit,
    dispatch,
  }) {
    console.log("calculating profit!!!");
    let profitFromPortfolio;
    try {
      let basePortfolioValue = state.portfolio.reduce((value, asset) => {
        if ("historicalPrice" in asset) {
          console.log("calculating per asset");
          return value + asset.historicalPrice * asset.quantity;
        } else
          throw new Error(
            "No historical data found on asset, profit cannot be calculated"
          );
      }, 0);
      profitFromPortfolio = getters.portfolioValue - basePortfolioValue;
    } catch (error) {
      console.log(error);
      profitFromPortfolio = 0;
    }
    commit("setProfitWallet", profitFromPortfolio, { root: true });
    dispatch(
      "updateUserAccount",
      {
        profitWallet: rootState.accountMangementModule.account.profitWallet,
      },
      { root: true }
    );
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
      let sharePrice = payload[index]?.regularMarketPrice
        ? payload[index].regularMarketPrice
        : 0;
      let sharePriceChangePercent = payload[index]?.regularMarketChangePercent
        ? payload[index].regularMarketChangePercent
        : 0;
      // I have to merge two separate share data from two different APIs as each was insufficient on its own
      state.shares.splice(
        index,
        1,
        Object.assign(share, {
          currentPrice: sharePrice,
          priceChange: sharePriceChangePercent,
        })
      );
    });
  },
  setPortfolio(state, payload) {
    if (payload) state.portfolio = payload;
    else state.portfolio = [];
  },
  updatePortfolioAssetAmount(state, payload) {
    /* eslint-disable no-unused-vars */
    payload.asset.quantity += payload.quantity;
    if (!payload.asset.quantity) {
      state.portfolio.splice(state.portfolio.indexOf(payload.asset), 1);
    }
  },
  createPortfolioAsset(state, payload) {
    state.portfolio.push({
      assetDetails: payload.asset,
      quantity: payload.quantity,
    });
  },
  updateAssetsPriceDataFromFetchedStocksData(state) {
    const assetsToUpdate = state.shares.forEach((share) => {
      for (const asset of state.portfolio) {
        if (asset.assetDetails.ticker === share.ticker) {
          asset.assetDetails.currentPrice = share.currentPrice;
          asset.assetDetails.priceChange = share.priceChange;
        }
      }
    });
  },
  setHistoricalPricesOnAssets(state, historicalPriceArray) {
    state.portfolio.forEach((asset, index) => {
      // asset = Object.assign({}, asset, {
      // historicalPrice: historicalPriceArray[index],
      // })
      state.shares.splice(
        index,
        1,
        Object.assign(asset, {
          historicalPrice: historicalPriceArray[index],
        })
      );
    });
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
