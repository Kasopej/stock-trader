import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import SignOutModal from "./components/UtilityComponents/SignOutModal.vue";
//Vue.config.productionTip = false;
Vue.component("SignOutModal", SignOutModal);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
