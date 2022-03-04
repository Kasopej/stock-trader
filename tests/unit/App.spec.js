import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import VueRouter from "vue-router";
import Vuex from "vuex";
import App from "@/App.vue";
import Login from "../../src/views/Login.vue";
import SignOutModal from "../../src/components/reused-components/SignOutModal.vue";

let localVue, router, store, toLogin;
describe("App.vue is the root vue instance", () => {
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(VueRouter);
    toLogin = undefined;
    const { authStoreModule } = getStoreModules();
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
  xit("has a router plugged in that routes to login page if user is not authenticated", async function (done) {
    setUpRouterInstance();
    const wrapper = mount(App, {
      localVue,
      store,
      router,
      stubs: ["SignOutModal"],
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
  xit("has a router plugged in that routes to home component if user is authenticated", function () {
    store.state.authStoreModule.authenticated = true;
    setUpRouterInstance();
    const wrapper = mount(App, {
      localVue,
      store,
      router,
      stubs: ["SignOutModal"],
      created() {},
    });

    expect(wrapper.vm.$route.name).toBe("home");
    wrapper.destroy();
  });
  xit("can trigger and render signout modal", async () => {
    localVue.component("SignOutModal", SignOutModal);
    store.state.authStoreModule.authenticated = true;
    setUpRouterInstance();
    const wrapper = mount(App, {
      localVue,
      store,
      router,
      attachTo: document.body,
      created() {},
    });
    //await wrapper.setData({ closeSignOutModal: true });
    //await wrapper.vm.$nextTick();
    expect(
      wrapper.findComponent(SignOutModal).find(".modal-body p").text()
    ).toMatch(/Should we sign you out/);
  });
  xit("uses the store plugin to automatically logout a user if time has elapsed", function () {
    jest.useFakeTimers();
    const wrapper = mount(App, {
      localVue,
      store,
      methods: {
        ["stockMangementModule/getSharesFromMarket"]: jest.fn(),
      },
    });
    jest.advanceTimersByTime(3700000);
    expect(authStoreModule.actions.logout).toHaveBeenCalled();
    jest.useRealTimers();
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

function getStoreModules() {
  return {
    authStoreModule: {
      state: {
        authenticated: false,
        idToken: "",
        expiresIn: 0,
        refreshToken: "",
      },
      getters: {
        isAuthenticated(state) {
          return state.authenticated;
        },
      },
      actions: {
        attemptUserRegistration({ commit, dispatch }, payload) {
          axiosAuthInstance
            .post(
              "accounts:signUp?key=AIzaSyDHcX11Hra8hH42TUNKyHltC8B-lgaifzg",
              {
                email: payload.email,
                password: payload.password,
                returnSecureToken: true,
              }
            )
            .catch((error) => {
              commit("throwError", {
                type: "registeration error",
                value: error,
              });
            })
            .then((res) => {
              console.log(res);
              const authData = res.data;
              authData.expiresIn *= 1000;
              commit("storeAuthData", authData);
              dispatch("createNewUserAccount", payload);
            });
        },
        attemptLogin({ commit, dispatch }, payload) {
          axiosAuthInstance
            .post(
              "accounts:signInWithPassword?key=AIzaSyDHcX11Hra8hH42TUNKyHltC8B-lgaifzg",
              {
                email: payload.email,
                password: payload.password,
                returnSecureToken: true,
              }
            )
            .catch((error) => {
              commit("throwError", { type: "login error", value: error });
            })
            .then((res) => {
              const authData = res.data;
              authData.expiresIn =
                authData.expiresIn * 1000 + new Date().valueOf();
              commit("storeAuthData", authData);
              commit("storeEmail", { email: payload.email });
              commit("login");
              dispatch("persistAuthData");
            })
            .catch((err) => {
              console.log(err);
            });
        },
        persistAuthData({ rootState, dispatch }) {
          localStorage.setItem("email", rootState.email);
          const { refreshToken, expiresIn } = rootState.authStoreModule;
          localStorage.setItem(
            "data",
            JSON.stringify({ refreshToken, expiresIn })
          );
          dispatch("scheduleAuthRefresh");
        },
        scheduleAuthRefresh({ dispatch, state }) {
          setTimeout(function () {
            dispatch("refreshAuth");
          }, state.expiresIn - new Date().valueOf());
        },
        refreshAuth({ dispatch, commit, state }) {
          axiosAuthInstance
            .post(
              "",
              {
                grant_type: "refresh_token",
                refresh_token: state.refreshToken,
              },
              {
                baseURL:
                  "https://securetoken.googleapis.com/v1/token?key=AIzaSyDHcX11Hra8hH42TUNKyHltC8B-lgaifzg",
                headers: { "Content-Type": "application/json" },
              }
            )
            .catch((error) => {
              commit("throwError", {
                type: "auth refresh error",
                value: error,
              });
              commit("logout");
            })
            .then((res) => {
              const data = res.data;
              commit("storeAuthData", {
                idToken: data.id_token,
                refreshToken: data.refresh_token,
                expiresIn: data.expires_in * 1000 + new Date().valueOf(),
              });
              commit("login");
              dispatch("scheduleAuthRefresh");
            });
        },
        attemptLoginOnLoad({ commit, dispatch }) {
          try {
            const email = localStorage.getItem("email");
            const authData = JSON.parse(localStorage.getItem("data"));
            if (authData.expiresIn < new Date().valueOf()) {
              throw new Error("Authentication has expired");
            }
            commit("storeAuthData", authData);
            commit("storeEmail", { email });
            commit("login");
            dispatch("persistAuthData");
          } catch (error) {
            console.log(error);
            dispatch("logout");
          }
        },
        logout({ commit }) {
          commit("logout");
          commit("clearEmail");
        },
      },
      mutations: {
        storeAuthData(state, authData) {
          state.idToken = authData.idToken;
          state.expiresIn = authData.expiresIn;
          state.refreshToken = authData.refreshToken;
        },
        login(state) {
          state.authenticated = true;
        },
        logout(state) {
          for (const key in state) {
            state[key] = "";
          }
          localStorage.removeItem("data");
          localStorage.removeItem("email");
        },
      },
    },
  };
}