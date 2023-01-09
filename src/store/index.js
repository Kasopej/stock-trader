/* eslint-disable no-unused-vars */
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import authStoreModule from "./modules/auth-store.js";
import accountMangementModule from "./modules/account-manager-store";
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {},
  mutations: {
    throwError(state, error) {
      state.error = error;
    },
    storeEmail(state, payload) {
      state.email = payload.email;
    },
  },
  actions: {},
  modules: {
    authStoreModule,
    accountMangementModule,
  },
});
