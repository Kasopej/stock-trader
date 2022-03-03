import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import VueRouter from "vue-router";
import Vuex from "vuex";
import App from "@/App.vue";
import Login from "../../src/views/Login.vue";
import SignOutModal from "../../src/components/UtilityComponents/SignOutModal.vue";

let localVue, router, store, toLogin;
describe("App.vue is the root vue instance", () => {
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(VueRouter);
    toLogin = undefined;
    const { authStoreModule } = getSimplifiedStoreModules();
    store = new Vuex.Store({
      state: {
        email: "",
      },
      mutations: {
        throwError(state, error) {
          state.error = error;
        },
        storeEmail(state, payload) {
          state.email = payload.email;
        },
        clearError() {
          state.error = null;
        },
      },
      actions: {},
      modules: {
        authStoreModule,
      },
    });
  });
  it("has a router plugged in that routes to login page if user is not authenticated", async function (done) {
    setUpRouterInstance();
    const wrapper = mount(App, {
      localVue,
      store,
      router,
      stubs: ["SignOutModal"],
      attachTo: document.body,
      created() {
        this.$router.onReady(() => {
          if (toLogin) {
            expect(this.$route.name).toBe("login");
            done();
          }
        });
      },
    });
    wrapper.destroy();
  });
  it("has a router plugged in that routes to home component if user is authenticated", function () {
    store.state.authStoreModule.authenticated = true;
    setUpRouterInstance();
    const wrapper = mount(App, {
      localVue,
      store,
      router,
      stubs: ["SignOutModal"],
      attachTo: document.body,
    });

    expect(wrapper.vm.$route.name).toBe("home");
    wrapper.destroy();
  });
  it("can trigger and render signout modal", async () => {
    localVue.component("SignOutModal", SignOutModal);
    store.state.authStoreModule.authenticated = true;
    setUpRouterInstance();
    const wrapper = mount(App, {
      localVue,
      store,
      router,
      attachTo: document.body,
    });
    //await wrapper.setData({ closeSignOutModal: true });
    //await wrapper.vm.$nextTick();
    expect(
      wrapper.findComponent(SignOutModal).find(".modal-body p").text()
    ).toMatch(/Should we sign you out/);
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
      },
    ],
    mode: "history",
  });
  router.beforeEach((to, from, next) => {
    if (to.name !== "login" && !store.state.authStoreModule.authenticated) {
      toLogin = true;
      next("/login");
    } else next();
  });
}

function getSimplifiedStoreModules() {
  return {
    authStoreModule: {
      state: {
        authenticated: false,
      },
      getters: {},
      actions: {},
      mutations: {
        login(state) {
          state.authenticated = true;
        },
      },
    },
  };
}
