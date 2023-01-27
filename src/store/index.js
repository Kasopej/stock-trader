/* eslint-disable no-unused-vars */
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import authStoreModule from "./modules/auth-store.js";
import accountMangementModule from "./modules/account-manager-store";

export default createStore({
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
