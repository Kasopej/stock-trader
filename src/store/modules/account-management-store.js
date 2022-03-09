import { axiosAccountInstance } from "../../services/network-services/axios-account";
import { axiosStocksInstance } from "../../services/network-services/axios-stocks";

const state = {
  account: null,
};
const getters = {
  name(state) {
    if (state.account?.email) {
      return state.account.email.slice(0, state.account.email.indexOf("@"));
    }
  },
  portfolioValue(state) {
    return state.account.portfolio.reduce(
      (value, asset) =>
        value + asset.assetDetails.currentPrice * asset.quantity,
      0
    );
  },
  bestPerformingAsset(state) {
    let highestGrowthRate = -1_000_000_000;
    let bestPerformingAssetIndex;
    state.account.portfolio.forEach((asset, index) => {
      if (asset.assetDetails.priceChange > highestGrowthRate) {
        highestGrowthRate = asset.assetDetails.priceChange;
        bestPerformingAssetIndex = index;
      }
    });
    if (highestGrowthRate > -1_000_000_000)
      return state.account.portfolio[bestPerformingAssetIndex];
    else
      return {
        assetDetails: { ticker: "no assets", priceChange: 0 },
        quantity: 0,
      };
  },
  worstPerformingAsset(state) {
    let lowestGrowthRate = 1_000_000_000;
    let worstPerformingAssetIndex;
    state.account.portfolio.forEach((asset, index) => {
      if (asset.assetDetails.priceChange < lowestGrowthRate) {
        lowestGrowthRate = asset.assetDetails.priceChange;
        worstPerformingAssetIndex = index;
      }
    });
    if (lowestGrowthRate < 1_000_000_000)
      return state.account.portfolio[worstPerformingAssetIndex];
    else
      return {
        assetDetails: { ticker: "no assets", priceChange: 0 },
        quantity: 0,
      };
  },
  netGrowth(state, getters) {
    try {
      let basePortfolioValue = state.account.portfolio.reduce(
        (value, asset) => {
          if ("historicalPrice" in asset)
            return value + asset.historicalPrice * asset.quantity;
          else throw Error("historical price not set on asset");
        },
        0
      );
      return getters.portfolioValue - basePortfolioValue;
    } catch (error) {
      console.log(error);
      return 0;
    }
  },
};
const actions = {
  createNewUserAccount({ dispatch, commit, rootState }, payload) {
    delete payload.password;
    payload = { ...payload, wallet: 2000, portfolio: null };
    axiosAccountInstance
      .post(
        "users.json" + `?auth=${rootState.authStoreModule.idToken}`,
        payload
      )
      .then(() => {
        dispatch("fetchUserAccount");
        dispatch("persistAuthData");
      })
      .catch((error) => {
        commit("throwError", { type: "createUserAccountError", value: error });
      });
  },
  updateUserAccount({ state, rootState }, payload) {
    return axiosAccountInstance.patch(
      `users/${state.account.id}.json` +
        `?auth=${rootState.authStoreModule.idToken}`,
      payload
    );
  },
  fetchUserAccount({ commit, dispatch, rootState }) {
    axiosAccountInstance
      .get("users.json" + `?auth=${rootState.authStoreModule.idToken}`)
      .then((res) => {
        const data = res.data;
        console.log("allUserData", data);
        let userAccount;
        for (const userIndex in data) {
          if (data[userIndex].email === rootState.email) {
            userAccount = data[userIndex];
            commit("storeUserAccount", { id: userIndex, ...userAccount });
            commit("login");
            return;
          }
        }
        dispatch("logout");
      });
  },
  performTransaction({ commit, dispatch, state }, amount) {
    commit("updateWallet", amount);
    return dispatch("updateUserAccount", { wallet: state.account.wallet });
  },
  updatePortfolioFromStock({ commit, state, dispatch }, payload) {
    const assetToUpdate = state.account.portfolio.find(
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
    return dispatch("updateUserAccount", {
      portfolio: state.account.portfolio,
    });
  },
  updatePortfolioFromAsset({ commit, dispatch, state }, payload) {
    commit("updatePortfolioAssetAmount", {
      asset: payload.asset,
      quantity: payload.quantity,
    });
    return dispatch("updateUserAccount", {
      portfolio: state.account.portfolio,
    });
  },
  getHistoricalPriceDataForAssets({ state, commit }) {
    let index = 0;
    const priceDataArray = [];
    let endInterval;
    let interval = setInterval(() => {
      console.log("getting historical update");
      axiosStocksInstance
        .get("", {
          baseURL: `https://financialmodelingprep.com/api/v3/historical-price-full/${state.account.portfolio[index].assetDetails.ticker}?from=2019-03-12&to=2019-03-12&apikey=92f991cbed3c4ac053149578277389e5`,
        })
        .then((res) => {
          console.log("historical update");
          console.log(res.data.historical[0].close);
          priceDataArray.splice(
            priceDataArray.length,
            0,
            res.data.historical[0].close
          );
          console.log(priceDataArray);

          if (endInterval) {
            console.log("clearing");
            clearInterval(interval);
            commit("setHistoricalPricesOnAssets", priceDataArray);
          }
        });
        index++;
      if (index === state.account.portfolio.length) {
        endInterval = true;
      }
    }, 30000);
  },
};
const mutations = {
  storeUserAccount(state, payload) {
    state.account = payload;
    if (!state.account.portfolio) state.account.portfolio = [];
  },
  updateWallet(state, amount) {
    state.account.wallet -= amount;
  },
  updatePortfolioAssetAmount(state, payload) {
    /* eslint-disable no-unused-vars */
    payload.asset.quantity += payload.quantity;
  },
  createPortfolioAsset(state, payload) {
    state.account.portfolio.push({
      assetDetails: payload.asset,
      quantity: payload.quantity,
    });
  },
  setHistoricalPricesOnAssets(state, payload) {
    payload.forEach(
      (historicalPrice, index) =>
        (state.account.portfolio[index].historicalPrice = historicalPrice)
    );
  },
  clearAccount(state) {
    state.account = null;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

/* eslint-disable no-unused-vars */
