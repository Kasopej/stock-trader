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
  updateUserAccount({ state, rootState }, payload) {
    console.log("updating user");
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
            commit("stockMangementModule/setPortfolio", userAccount.portfolio);
            delete userAccount.portfolio;
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
