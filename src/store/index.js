import Vue from "vue";
import Vuex from "vuex";
import authStoreModule from "./modules/auth-store";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    authStoreModule,
  },
});
