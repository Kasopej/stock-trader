import Vue from "vue";
// import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import SignOutModal from "./components/UtilityComponents/SignOutModal.vue";
//Vue.config.productionTip = false;

import "@/assets/scss/custom.scss";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase_config";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
installFirebase();

Vue.component("SignOutModal", SignOutModal);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

function installFirebase() {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  return app;
}
