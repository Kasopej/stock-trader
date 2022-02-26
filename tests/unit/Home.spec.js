import { createLocalVue, mount } from "@vue/test-utils";
import VueRouter from "vue-router";
import Vuex from "vuex";
import App from "@/App.vue";

let router, store;
describe("App is the root vue instance", () => {
  it("loads a home component", function () {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(VueRouter);
    setUpRouterInstance();
    store = new Vuex.Store({
      state: {
        authenticated: false,
      },
    });
    const wrapper = mount(App, { localVue, store, router });
    expect(wrapper.vm.$route.name).toBe("login");
    console.log(window.location.href);
    wrapper.destroy();
  });
  it("routes to login page if user is not authenticated", function () {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(VueRouter);
    setUpRouterInstance();
    store = new Vuex.Store({
      state: {
        authenticated: true,
      },
    });
    const wrapper = mount(App, { localVue, store, router });
    expect(wrapper.vm.$route.name).toBe("home");
    console.log(window.location.href);
    wrapper.destroy();
  });
});

function setUpRouterInstance() {
  window.location.href = window.location.origin;
  router = new VueRouter({
    routes: [
      {
        path: "/login",
        name: "login",
      },
      {
        path: "/",
        name: "home",
      },
    ],
    mode: "history",
  });
  router.beforeEach((to, from, next) => {
    console.log(from.name, store.state.authenticated, to.name);
    if (to.name !== "login" && !store.state.authenticated) {
      next("/login");
    } else next();
  });
}
