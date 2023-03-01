import { createLocalVue, mount } from "@vue/test-utils";
import VueRouter from "vue-router";
import Vuex from "vuex";
import App from "@/App.vue";
import Login from "../../src/views/Login.vue";

let router, store, toLogin;
describe("App.vue is the root vue instance", () => {
  it("routes to login page if user is not authenticated", async function (done) {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(VueRouter);
    setUpRouterInstance();
    store = new Vuex.Store({
      state: {
        authenticated: false,
      },
    });
    const wrapper = mount(App, {
      localVue,
      store,
      router,
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
  it("routes to home component if user is authenticated", function () {
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
    wrapper.destroy();
  });
});

function setUpRouterInstance() {
  //window.location.href = window.location.origin;
  console.log(window.location);
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
    if (to.name !== "login" && !store.state.authenticated) {
      toLogin = true;
      next("/login");
    } else next();
  });
}
