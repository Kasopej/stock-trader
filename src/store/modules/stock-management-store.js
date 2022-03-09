/* eslint-disable no-unused-vars */
import { axiosStocksInstance } from "../../services/network-services/axios-stocks";
const state = {
  shares: [],
  portfolio: [],
};
const mutations = {
  setSharesData(state, payload) {
    state.shares.splice(0, state.shares.length, ...payload);
  },
  addMissingSymbols(state, payload) {
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
                  commit("addMissingSymbols", res.data);
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
        dispatch("getPriceData", symbols);
      });
    setTimeout(() => {
      dispatch("getSymbolsFromMarket");
    }, 43200000);
  },
  getPriceData({ commit, dispatch }, symbols) {
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
          /*
          if (res.data.quoteResponse.result.length < 10) {
            endInterval = true;
          }
          */
          if (endInterval) {
            console.log("clearing");
            clearInterval(interval);
            commit("setSharePrices", priceDataArray);
            dispatch("getHistoricalPriceDataForAssets", null, { root: true });
          }
        });
      start += 10;
      end += 10;
      if (start >= symbols.length) {
        endInterval = true;
      }
      console.log(start, end);
    }, 30000);

    //commit("setSharePrices", prices);
  },
};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
