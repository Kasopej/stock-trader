import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import App from "@/App.vue";

let localVue, wrapper, storeObj, store, $router;
describe("App is the root Vue instance", function () {
  beforeEach(async () => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    storeObj = await loadFakedStore();
    store = new Vuex.Store(storeObj);
    store.dispatch = jest.fn(() => {
      return new Promise((resolve, reject) => resolve(1));
    });
    $router = {
      push: jest.fn(),
    };
    wrapper = shallowMount(App, {
      localVue,
      store,
      attachTo: document.body,
      mocks: {
        $router,
      },
      stubs: ["router-view"],
    });
  });
  afterEach(() => {
    wrapper.destroy();
    jest.resetAllMocks();
  });
  it("It dispatches an authentication action once created", () => {
    expect(store.dispatch).toHaveBeenCalledWith("attemptLoginOnLoad");
  });
  it("It pushes a new route record to the router object if the authentication state changes to true", async () => {
    wrapper.vm.$store.state.authStoreModule.authenticated = true;
    expect.assertions(2);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$router.push).toBeCalled();
  });
});

async function loadFakedStore() {
  jest.mock("@/store/modules/account-management-store");
  jest.mock("@/store/modules/auth-store");
  jest.mock("@/store/modules/stock-management-store");

  const accountMgr = await import("@/store/modules/account-management-store");
  const authMgr = await import("@/store/modules/auth-store");
  const stockMgr = await import("@/store/modules/stock-management-store");
  return {
    state: {
      storeError: "",
    },
    getters: {},
    mutations: {
      throwStoreError(state, error) {
        state.storeError = error;
      },
      clearError(state) {
        state.error = null;
      },
      storeEmail(state, email) {
        state.email = email;
      },
    },
    actions: {},
    modules: {
      authStoreModule: authMgr.default,
      accountMangementModule: accountMgr.default,
      stockMangementModule: {
        namespaced: true,
        ...stockMgr.default,
      },
    },
  };
}
