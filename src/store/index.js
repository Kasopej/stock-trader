/* eslint-disable no-unused-vars */
import Vue from "vue";
import Vuex from "vuex";
import authStoreModule from "./modules/auth-store.js";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {
    throwError(state, errorType) {
      state.error = errorType;
    },
  },
  actions: {},
  modules: {
    authStoreModule,
  },
});
