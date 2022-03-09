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
    console.log("in wallet");
    commit("updateWallet", amount);
    return dispatch("updateUserAccount", { wallet: state.account.wallet });
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
