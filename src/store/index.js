/* eslint-disable no-unused-vars */

import Vue from "vue";
import Vuex from "vuex";
import authStoreModule from "./modules/auth-store.js";
import accountMangementModule from "./modules/account-management-store";
import stockMangementModule from "./modules/stock-management-store";
Vue.use(Vuex);

export default new Vuex.Store({
  /* eslint-disable no-undef */
  state: {
    email: "",
  },
  getters: {
    name(state) {
      return state.email.slice(0, state.email.indexOf("@"));
    },
  },
  mutations: {
    throwError(state, error) {
      state.error = error;
    },
    storeEmail(state, payload) {
      state.email = payload.email;
    },
    clearError(state) {
      state.error = null;
    },
    clearEmail(state) {
      state.email = "";
    },
  },
  actions: {},
  modules: {
    authStoreModule,
    accountMangementModule,
    stockMangementModule: {
      namespaced: true,
      ...stockMangementModule,
    },
  },
});
