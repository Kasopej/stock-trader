/* eslint-disable no-unused-vars */
import { axiosAuthInstance } from "../../services/network-services/axios-auth";
import axios from "axios";

const state = {
  authenticated: true,
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
      .then((res) => {
        console.log(res);
      })
      .catch(() => {
        commit("throwError", "registerationError");
      });
  },
  attemptLogin() {},
  logout() {},
};

const mutations = {
  authenticateUser() {},
  storeUserDetails() {},
  logout() {},
};

export default {
  state,
  getters,
  actions,
  mutations,
};
