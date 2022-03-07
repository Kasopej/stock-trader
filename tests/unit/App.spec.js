import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import VueRouter from "vue-router";
import Vuex from "vuex";
import App from "@/App.vue";
import Login from "../../src/views/Login.vue";
import Home from "../../src/views/Home.vue";
import authStoreModule from "../../src/store/modules/auth-store";
//import SignOutModal from "../../src/components/reused-components/SignOutModal.vue";

let localVue, router, baseStore, store, toLogin;
describe("App.vue is the root vue instance", () => {
  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(VueRouter);
    toLogin = undefined;
    baseStore = getBaseStore();
  });
  xit("has a router plugged in that routes to login page if user is not authenticated", async function () {
    App.created = jest.fn();
    setUpRouterInstance();
    baseStore.modules.authStoreModule = authStoreModule;
    store = new Vuex.Store(baseStore);
    jest
      .spyOn(Object.getPrototypeOf(window.localStorage), "getItem")
      .mockReturnValueOnce("kasopej@gmail.com")
      .mockReturnValueOnce(
        JSON.stringify({
          refreshToken: "dfghsjjs",
          expiresIn: new Date().valueOf() + 3600000,
        })
      );

    const wrapper = mount(App, {
      localVue,
      store,
      router,
      stubs: ["SignOutModal"],
      created() {
        console.log("created App");
        this.$store.dispatch("attemptLoginOnLoad");
        this.$router.onReady(() => {
          console.log("router fully ready");
        });
      },
    });
    expect(wrapper.vm.$route.name).toBe(null);
    /*
    wrapper.vm.$options.watch["$store.state.authStoreModule.authenticated"] =
      jest.fn(() => {
        console.log("mocked watcher");
      });
      */
    wrapper.destroy();
  });
});

function setUpRouterInstance() {
  //window.location.href = window.location.origin;
  router = new VueRouter({
    routes: [
      {
        path: "/login",
        name: "login",
        component: Login,
      },

      {
        path: "/",
        name: "home",
        component: Home,
      },
    ],
    mode: "history",
  });
  router.beforeEach((to, from, next) => {
    console.log("guarding");
    console.log(to.name, 0);
    setTimeout(() => {
      if (
        to.name !== "login" &&
        to.name !== "register" &&
        !store.state.authStoreModule.authenticated
      ) {
        next("/login");
      } else if (
        (to.name === "login" || to.name === "register") &&
        store.state.authStoreModule.authenticated
      ) {
        next("/home");
      } else next();
    }, 300);
  });
}

function getBaseStore() {
  return {
    state: {
      email: "",
    },
    getters: {
      name(state) {
        return state.email.slice(0, state.email.indexOf("@"));
      },
    },
    mutations: {
      throwError(state, error) {
        state.error = error;
      },
      storeEmail(state, payload) {
        state.email = payload.email;
      },
      clearError(state) {
        state.error = null;
      },
      clearEmail(state) {
        state.email = "";
      },
    },
    actions: {},
    modules: {},
  };
}