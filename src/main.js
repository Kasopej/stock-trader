import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import SignOutModal from "./components/UtilityComponents/SignOutModal.vue";
//Vue.config.productionTip = false;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseApp = installFirebase();
Vue.component("SignOutModal", SignOutModal);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");






function installFirebase(){
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDHcX11Hra8hH42TUNKyHltC8B-lgaifzg",
    authDomain: "personalstocktrader-7717a.firebaseapp.com",
    projectId: "personalstocktrader-7717a",
    storageBucket: "personalstocktrader-7717a.appspot.com",
    messagingSenderId: "137494008472",
    appId: "1:137494008472:web:224cbfab527ba96ffe76ed"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  return app
}
