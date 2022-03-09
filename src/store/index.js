/* eslint-disable no-unused-vars */

import Vue from "vue";
import Vuex from "vuex";
import authStoreModule from "./modules/auth-store.js";
import accountMangementModule from "./modules/account-management-store";
import stockMangementModule from "./modules/stock-management-store";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

export default new Vuex.Store({
  /* eslint-disable no-undef */
  plugins: [createPersistedState()],
  state: {},
  getters: {},
  mutations: {
    throwError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    },
    storeEmail(state, email) {
      state.email = email;
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
