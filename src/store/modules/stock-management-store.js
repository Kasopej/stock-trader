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
      ? !state.shares.find((share) => !("currentPrice" in share)) //return an element only when currentPrice property does not exist
      : false;
    //resolves to false if element is returned by find or returns false if no shares ib store
  },
  portfolioValue(state) {
    return state.portfolio.reduce(
      (value, asset) =>
        value + asset.assetDetails.currentPrice * asset.quantity,
      0
    );
  },
  bestPerformingAsset(state) {
    //return share with highest price change rate, start comparison with -1_000_000
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
    //return share with lowest price change rate, start comparison with 1_000_000
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
    //fetch basic share data from polygon API
    axiosStocksInstance
      .get("", {
        baseURL:
          "https://api.polygon.io/v3/reference/tickers?market=stocks&exchange=XNAS&active=true&sort=ticker&order=asc&limit=50&apiKey=YtTjMC3PISJ78qtZOK7W2zGcTsNfpK9x",
      })
      .then((res) => {
        const data = res.data.results;
        commit("setSharesData", data);
        const arrayOfSymbols = state.shares.map((element) => {
          return element.ticker; //extract tickers into array to use for next API call to get priceData
        });
        if (arrayOfSymbols.length)
          dispatch("getPriceDataForShares", arrayOfSymbols);
      });
    setTimeout(() => {
      dispatch("getSymbolsFromMarket"); //re-run this action in 12 hours to refresh store with fresh shares data (that us, if app is left running)
    }, 43200000);
  },
  getPriceDataForShares({ commit, dispatch, state }, arrayOfSymbols) {
    let start = 0;
    let end = 10;
    const priceDataArray = [];
    let endInterval;
    let interval = setInterval(() => {
      let queryURLForTenShares = arrayOfSymbols.slice(start, end).join("%2C"); //iteratively pick 10 ticker symbols from array and join into string in url format for API call
      axiosStocksInstance
        .get("", {
          baseURL: `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${queryURLForTenShares}`,
          headers: {
            "X-API-KEY": "ub01U3BpIb7btlg8e6cD41azFJqmDCt76HUMA019",
            accept: "application/json",
          },
        })
        .then((res) => {
          priceDataArray.splice(
            priceDataArray.length,
            0,
            ...res.data.quoteResponse.result
          ); //save price data API response in array
          if (endInterval) {
            commit("setSharePrices", priceDataArray);
            commit("updateAssetsPriceDataFromFetchedStocksData", state.shares); //update assets with fresh price data from API
            let lastFridayDate = dayjs()
              .day(5)
              .subtract(7, "d")
              .format("YYYY-MM-DD"); //use dayjs to get date of last friday. This is used to get las week's close prices
            dispatch("getHistoricalPriceDataForAssets", lastFridayDate);
          }
        });
      start += 10;
      end += 10;
      if (start >= arrayOfSymbols.length) {
        endInterval = true;
        clearInterval(interval);
      }
    }, 20000);
  },
  getHistoricalPriceDataForAssets({ state, dispatch, commit }, payload) {
    //use last week friday date to query last week close price from API
    let index = 0;
    const priceDataArray = [];
    let endInterval;
    if (state.portfolio.length) {
      //free API allows only one stock to be queried at once, hence need to loop through each stock asset in portfolio
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
              //if asset stock does not have record in the db or if the request otherwise fails, set last week price to zero
              priceDataArray.splice(priceDataArray.length, 0, 0);
            }
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
  updatePortfolioFromStock({ commit, state, dispatch }, payload) {
    //update portfolio array with stock data from stock transaction action. This action is fored from Stock vue component. Payload is the Stock vue component that fired the action
    const assetToUpdate = state.portfolio.find(
      (asset) => payload.stock.ticker === asset.assetDetails.ticker
    ); //check and return if the stock that fired the action already exists in portfolio array
    if (assetToUpdate) {
      commit("updatePortfolioAssetAmount", {
        asset: assetToUpdate,
        quantity: payload.quantity,
      });
    } else {
      //if not, add stock as new asset in portfolio array
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
    //update portfolio array with data from asset that already exists in portfolio. e,g buying more shares of a portfolio asset or selling
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
  calculateProfitFromPortfolio({
    state,
    rootState,
    getters,
    commit,
    dispatch,
  }) {
    let profitFromPortfolio;
    try {
      let basePortfolioValue = state.portfolio.reduce((value, asset) => {
        //use reduce method to cumulatively calculate value of asset based on last week close prices
        if ("historicalPrice" in asset) {
          return asset.historicalPrice === 0
            ? value + asset.historicalPrice * asset.quantity
            : value + asset.currentPrice * asset.quantity; //if historical price is zero i.e was not found during API call, use current pruice for calculation instead
        } else
          throw new Error( //if historicalPrice property does not exist throw out of reduce method
            "No historical data found on asset, profit cannot be calculated"
          );
      }, 0);
      profitFromPortfolio = getters.portfolioValue - basePortfolioValue;
    } catch (error) {
      console.log(error);
      //if error thrown set profit to zero
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
        //need to carry out a reactive operation on shares for vue to be aware of update in areAllSharesPricesAvailable getter
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
    payload.asset.quantity += payload.quantity; //quantity can be positive or negative integer. Comes from transaction quantity payload from the action that committed this mutation
    if (!payload.asset.quantity) {
      //if asset stock quantity has been decremented to zero, remove asset
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
    state.shares.forEach((share) => {
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
