/* eslint-disable no-unused-vars */
import { axiosAuthInstance } from "../../services/network-services/axios-auth";

const state = {
  authenticated: false,
  idToken: "",
  tokenExpiresBy: 0,
  refreshToken: "",
};
const getters = {};

const actions = {
  attemptUserRegistration({ commit, dispatch, rootState }, payload) {
    axiosAuthInstance
      .post("accounts:signUp?key=AIzaSyDHcX11Hra8hH42TUNKyHltC8B-lgaifzg", {
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      })
      .then((res) => {
        console.log(res);
        const authData = res.data;
        authData.expiresIn *= 1000;
        commit("storeAuthData", authData);
        dispatch("createNewUserAccount", payload);
      })
      .catch((error) => {
        commit("throwError", { type: "registerationError", value: error });
      });
  },
  attemptLogin() {},
  logout() {},
};

const mutations = {
  storeAuthData(state, authData, rootState) {
    console.log("locak storeAuthData mutation");
    state.idToken = authData.idToken;
    state.tokenExpiresBy = new Date(
      new Date().valueOf() + authData.expiresIn
    ).valueOf();
    state.refreshToken = authData.refreshToken;
  },
  login(state) {
    state.authenticated = true;
  },
  logout() {},
};

export default {
  state,
  getters,
  actions,
  mutations,
};
