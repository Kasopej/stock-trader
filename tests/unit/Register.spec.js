import { createLocalVue, mount } from "@vue/test-utils";
import Register from "@/views/Register.vue";
import { screen } from "@testing-library/vue";
import Vuex from "vuex";
import axios from "axios";

describe("Register.vue is the component where new users are onboarded", () => {
  let wrapper, localVue, store, $router;
  beforeEach(() => {
    localVue = createLocalVue();
    //localVue.use(VueRouter);
    localVue.use(Vuex);
    //axios.post = jest.fn();
    const { accountMangementModule, authStoreModule } = getStoreModules();
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
      },
      actions: {},
      modules: {
        accountMangementModule,
        authStoreModule,
      },
    });
    $router = {
      push: jest.fn(),
    };
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("posts a new account to DB & authenticates session if the signup is successful", async () => {
    const authResponse = {
      data: {
        idToken: "sjhshhshs",
        expiresIn: 900,
        refreshToken: "jhdjsjjsjskkskksksksks",
      },
    };
    const user = {
      email: "kasopej@gmail.com",
      wallet: 0,
    };
    axios.post = jest
      .fn()
      .mockResolvedValueOnce(authResponse)
      .mockResolvedValueOnce(user);
    wrapper = mount(Register, {
      localVue,
      store,
      mocks: {
        $router,
      },
      stubs: ["router-link"],
      attachTo: document.body,
    });
    await wrapper.vm.$store.dispatch("attemptUserRegistration", {
      email: "kasopej@gmail.com",
      password: "password",
      returnSecureToken: true,
    });
    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.$store.state.authStoreModule.authenticated).toBeTruthy();
    wrapper.destroy();
  });
  it("");
});

function getStoreModules() {
  return {
    authStoreModule: {
      state: {
        authenticated: false,
        idToken: "",
        tokenExpiresBy: 0,
        refreshToken: "",
      },
      getters: {},
      actions: {
        attemptUserRegistration({ commit, dispatch }, payload) {
          axios
            .post(
              "accounts:signUp?key=AIzaSyDHcX11Hra8hH42TUNKyHltC8B-lgaifzg",
              {
                email: payload.email,
                password: payload.password,
                returnSecureToken: true,
              }
            )
            .then((res) => {
              const authData = res.data;
              authData.expiresIn *= 1000;
              commit("storeAuthData", authData);
              dispatch("createNewUserAccount", payload);
            })
            .catch((error) => {
              commit("throwError", {
                type: "registerationError",
                value: error,
              });
            });
        },
        attemptLogin() {},
        logout() {},
      },
      mutations: {
        storeAuthData(state, authData) {
          state.idToken = authData.idToken;
          state.tokenExpiresBy = new Date(
            new Date().valueOf() + authData.expiresIn
          ).valueOf();
          state.refreshToken = authData.refreshToken;
        },
        login(state) {
          state.authenticated = true;
        },
      },
    },
    accountMangementModule: {
      state: {
        account: null,
      },
      getters: {},
      actions: {
        createNewUserAccount({ commit, rootState }, payload) {
          delete payload.password;
          payload = { ...payload, wallet: 0, portfolio: {} };
          axios
            .post(
              "users.json" + `?auth=${rootState.authStoreModule.idToken}`,
              payload
            )
            .then(() => {
              commit("storeEmail", { email: payload.email });
              commit("login");
              console.log(rootState.authStoreModule);
              console.log(rootState.accountMangementModule);
            })
            .catch((error) => {
              commit("throwError", {
                type: "createUserAccountError",
                value: error,
              });
            });
        },
        updateUserAccount() {},
        fetchUserAccount({ commit, rootState }) {
          axios
            .get("users.json" + `?auth=${rootState.authStoreModule.idToken}`)
            .then((res) => {
              const data = res.data;
              let userAccount;
              for (const userIndex in data) {
                if (data[userIndex].email === rootState.email) {
                  userAccount = data[userIndex];
                  commit("storeUserAccount", userAccount);
                  break;
                }
              }
            });
        },
      },
      mutations: {
        storeUserAccount(state, userAccount) {
          state.account = userAccount;
        },
      },
    },
  };
}
