import { axiosAuthInstance } from "../../services/network-services/axios-auth";

const state = {
  authenticated: false,
  idToken: "",
  tokenExpiresBy: 0,
  refreshToken: "",
};
const getters = {};

const actions = {
  attemptUserRegistration({ commit, dispatch }, payload) {
    axiosAuthInstance
      .post("accounts:signUp?key=AIzaSyDHcX11Hra8hH42TUNKyHltC8B-lgaifzg", {
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      })
      .catch((error) => {
        commit("throwError", { type: "registeration error", value: error });
      })
      .then((res) => {
        console.log(res);
        const authData = res.data;
        authData.expiresIn *= 1000;
        commit("storeAuthData", authData);
        dispatch("createNewUserAccount", payload);
      });
  },
  attemptLogin({ commit }, payload) {
    axiosAuthInstance
      .post(
        "accounts:signInWithPassword?key=AIzaSyDHcX11Hra8hH42TUNKyHltC8B-lgaifzg",
        {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }
      )
      .catch((error) => {
        commit("throwError", { type: "login error", value: error });
      })
      .then((res) => {
        const authData = res.data;
        authData.expiresIn *= 1000;
        commit("storeAuthData", authData);
        commit("login");
      });
  },
  logout() {},
};

const mutations = {
  storeAuthData(state, authData) {
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

/* eslint-disable no-unused-vars */
