import { axiosAccountInstance } from "../../services/network-services/axios-account";

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
    payload = { ...payload, wallet: 0, profitWallet: 0, portfolio: null };
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
  fetchUserAccount({ commit, dispatch, rootState, state }) {
    axiosAccountInstance
      .get("users.json" + `?auth=${rootState.authStoreModule.idToken}`)
      .then((res) => {
        const data = res.data;
        let userAccount;
        for (const userIndex in data) {
          if (data[userIndex].email === rootState.email) {
            userAccount = data[userIndex];
            commit("stockMangementModule/setPortfolio", userAccount.portfolio);
            delete userAccount.portfolio;
            commit("storeUserAccount", { id: userIndex, ...userAccount });
            console.log("fetched account", state.account);
            commit("login");
            return;
          }
        }
        dispatch("logout");
      });
  },
  updateUserAccount({ state, rootState, dispatch, commit }, payload) {
    console.log("updating user");
    if (state.account.id) {
      return axiosAccountInstance
        .patch(
          `users/${state.account.id}.json` +
            `?auth=${rootState.authStoreModule.idToken}`,
          payload
        )
        .then(() => {
          return dispatch("fetchUserAccountUpdates");
        });
    } else
      commit(
        "throwStoreError",
        "user not identified. Please refresh your page"
      );
  },
  fetchUserAccountUpdates({ commit, rootState, state }) {
    axiosAccountInstance
      .get(
        `users/${state.account.id}.json` +
          `?auth=${rootState.authStoreModule.idToken}`
      )
      .then((res) => {
        const userAccount = res.data;
        commit("stockMangementModule/setPortfolio", userAccount.portfolio);
        delete userAccount.portfolio;
        commit("storeUserAccount", userAccount);
        console.log("fetched account updates", state.account);
      });
  },
  performTransaction({ commit, dispatch, state }, amount) {
    console.log("in wallet");
    commit("updateWallet", amount);
    return dispatch("updateUserAccount", { wallet: state.account.wallet });
  },
  performTransactionOnProfitWallet({ commit, dispatch, state }, amount) {
    console.log("in profit wallet");
    commit("updateProfitWallet", amount);
    return dispatch("updateUserAccount", {
      profitWallet: state.account.profitWallet,
    });
  },
  updateCardTransactionLog({ commit, dispatch, state }, payload) {
    commit("updateCardTransactionLog", payload);
    return dispatch("updateUserAccount", {
      cardTransactionsLog: state.account.cardTransactionsLog,
    });
  },
};
const mutations = {
  storeUserAccount(state, payload) {
    state.account = payload;
    if (!state.account.cardTransactionsLog) {
      state.account.cardTransactionsLog = [];
    }
  },
  updateWallet(state, amount) {
    state.account.wallet += amount;
  },
  updateProfitWallet(state, amount) {
    state.account.profitWallet += amount;
  },
  updateCardTransactionLog(state, payload) {
    console.log("updating log");
    state.account.cardTransactionsLog.push(payload);
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
