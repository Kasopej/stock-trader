import { axiosAccountInstance } from "../../services/network-services/axios-account";

const state = {
  account: null,
};
const getters = {
  name(state) {
    //returns the portion of the email before the @ sign
    return state.account?.email
      ? state.account.email.slice(0, state.account.email.indexOf("@"))
      : "";
  },
  wallet(state) {
    return state.account?.wallet;
  },
  profit(state) {
    return state.account?.profitWallet;
  },
};
const actions = {
  async createNewUserAccount({ dispatch, commit, rootState }, payload) {
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
        console.log(error);
        commit("throwError", { type: "createUserAccountError", value: error });
      });
  },
  fetchUserAccount({ commit, dispatch, rootState }) {
    axiosAccountInstance
      .get("users.json" + `?auth=${rootState.authStoreModule.idToken}`)
      .then((res) => {
        const data = res.data;
        /*loop through the container object containing all users from the db, then filter out the accoun corresponding to the signed in user by comparing the email values. If corresponding user account not found in db, log out */
        let userAccount;
        for (const userIndex in data) {
          if (data[userIndex].email === rootState.email) {
            userAccount = data[userIndex];
            commit("stockMangementModule/setPortfolio", userAccount.portfolio);
            delete userAccount.portfolio;
            commit("storeUserAccount", { id: userIndex, ...userAccount });
            dispatch("stockMangementModule/calculateProfitFromPortfolio");
            commit("login");
            return;
          }
        }
        dispatch("logout");
      });
  },
  updateUserAccount({ state, rootState, dispatch, commit }, payload) {
    if (state.account?.id) {
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
    /* After an update is carried out on a user account in the db, fetch the updated record from the db */
    axiosAccountInstance
      .get(
        `users/${state.account.id}.json` +
          `?auth=${rootState.authStoreModule.idToken}`
      )
      .then((res) => {
        const userAccount = res.data;
        commit("stockMangementModule/setPortfolio", userAccount.portfolio);
        delete userAccount.portfolio;
        commit("storeUserAccount", { id: state.account.id, ...userAccount });
      });
  },
  performTransaction({ commit, dispatch, state }, amount) {
    commit("updateWallet", amount);
    return dispatch("updateUserAccount", { wallet: state.account.wallet });//update account on db with new db value
  },
  performTransactionOnProfitWallet({ commit, dispatch, state }, amount) {
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
    if (!state.account.cardTransactionsLog) {//if no transaction logs in payload, initialize empty array for transaction logging
      state.account.cardTransactionsLog = [];
    }
  },
  updateWallet(state, amount) {
    state.account.wallet += amount;
  },
  setProfitWallet(state, amount) {
    state.account.profitWallet = amount;
  },
  updateProfitWallet(state, amount) {
    state.account.profitWallet += amount;
  },
  updateCardTransactionLog(state, payload) {
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
