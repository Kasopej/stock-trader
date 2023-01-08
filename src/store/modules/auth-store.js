/* eslint-disable no-unused-vars */
import { axiosAuthInstance } from "../../services/network-services/axios-auth";
import { firebaseConfig } from "../../firebase_config";

const state = {
  authenticated: false,
  authData: {},
};
const getters = {};

const actions = {
  attemptUserRegistration({ commit, dispatch, rootState }, payload) {
    axiosAuthInstance
      .post(`:signUp?key=${firebaseConfig.apiKey}`, {
        ...payload,
        returnSecureToken: true,
      })
      .then((res) => {
        const authData = res.data;
        authData.expiresIn *= 1000;
        commit("storeAuthData", authData);
        dispatch("createNewUserAccount", payload);
      })
      .catch((error) => {
        commit("throwError", { type: "registerationError", value: error });
      });
  },
  attemptLogin({ commit }, payload) {
    return axiosAuthInstance
      .post(`:signInWithPassword?key=${firebaseConfig.apiKey}`, {
        ...payload,
        returnSecureToken: true,
      })
      .then((res) => {
        const authData = res.data;
        authData.expiresIn *= 1000;
        commit("storeAuthData", authData);
        commit("login");
      });
  },
};

const mutations = {
  storeAuthData(state, authData, rootState) {
    state.idToken = authData.idToken;
    state.tokenExpiresBy = new Date(
      new Date().valueOf() + authData.expiresIn
    ).valueOf();
    state.refreshToken = authData.refreshToken;
  },
  login(state) {
    state.authenticated = true;
  },
  logout(state) {
    state.authenticated = false;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
