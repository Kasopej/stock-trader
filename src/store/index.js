/* eslint-disable no-unused-vars */

import Vue from "vue";
import Vuex from "vuex";
import authStoreModule from "./modules/auth-store.js";
import accountMangementModule from "./modules/account-manager-store";
Vue.use(Vuex);

export default new Vuex.Store({
  /* eslint-disable no-undef */
  state: {
    email: "",
  },
  getters: {
    name(state) {
      return state.email.slice;
    },
  },
  mutations: {
    throwError(state, error) {
      state.error = error;
    },
    storeEmail(state, payload) {
      state.email = payload.email;
    },
    clearError() {
      state.error = null;
    },
  },
  actions: {},
  modules: {
    authStoreModule,
    accountMangementModule,
  },
});
