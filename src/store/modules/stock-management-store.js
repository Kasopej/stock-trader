import { axiosStocksInstance } from "../../services/network-services/axios-stocks";
const state = {
  shares: [],
  portfolio: [],
};
const mutations = {
  storeShares(state, payload) {
    state.shares.splice(0, state.shares.length, ...payload);
  },
  storeAndOrderMissingShares(state, payload) {
    state.shares.splice(state.shares.length - 1, 0, payload[0]);
    state.shares.sort((a, b) => {
      return a.symbol < b.symbol ? -1 : 1;
    });
  },
};
const actions = {
  getSharesFromMarket({ state, commit }) {
    axiosStocksInstance
      .get(
        "v3/search-ticker?query=&limit=50&exchange=NASDAQ&apikey=92f991cbed3c4ac053149578277389e5"
      )
      .then((res) => {
        const data = res.data;
        commit("storeShares", data);
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
                  commit("storeAndOrderMissingShares", res.data);
                } else {
                  throw new Error(
                    "asset not found in stock market! Kindly send us a mail"
                  );
                }
              })
              .catch((error) => console.log(error));
          }
        }
      });
  },
};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
