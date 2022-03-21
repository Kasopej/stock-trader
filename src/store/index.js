/* eslint-disable no-unused-vars */

import Vue from "vue";
import Vuex from "vuex";
import authStoreModule from "./modules/auth-store.js";
import accountMangementModule from "./modules/account-management-store";
import stockMangementModule from "./modules/stock-management-store";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

export const storeData = {
  state: {
    storeError: "",
  },
  getters: {},
  mutations: {
    throwStoreError(state, error) {
      state.storeError = error;
    },
    clearError(state) {
      state.storeError = null;
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
};
export default new Vuex.Store({
  /* eslint-disable no-undef */
  plugins: [createPersistedState()],
  ...storeData,
});
