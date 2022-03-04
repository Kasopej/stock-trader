import { axios } from "../../services/network-services/axios-global";

const state = {
  account: null,
};
const getters = {};
const actions = {
  createNewUserAccount({ dispatch, commit, rootState }, payload) {
    delete payload.password;
    payload = { ...payload, wallet: 0, portfolio: {} };
    axios
      .post(
        "users.json" + `?auth=${rootState.authStoreModule.idToken}`,
        payload
      )
      .then(() => {
        commit("storeEmail", { email: payload.email });
        commit("login");
        dispatch("persistAuthData");
      })
      .catch((error) => {
        commit("throwError", { type: "createUserAccountError", value: error });
      });
  },
  updateUserAccount() {},
  fetchUserAccount({ commit, rootState }) {
    axios
      .get("users.json" + `?auth=${rootState.authStoreModule.idToken}`)
      .then((res) => {
        const data = res.data;
        let userAccount;
        for (const userIndex in data) {
          if (data[userIndex].email === rootState.email) {
            userAccount = data[userIndex];
            commit("storeUserAccount", userAccount);
            break;
          }
        }
      });
  },
};
const mutations = {
  storeUserAccount(state, userAccount) {
    state.account = userAccount;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

/* eslint-disable no-unused-vars */
