import { createLocalVue, mount } from "@vue/test-utils";
import { fireEvent, screen } from "@testing-library/vue";
import Wallet from "@/views/Wallet.vue";
import Vuex from "vuex";

describe("Wallet is the component that allows the user to view and manage their main & profit wallets", function () {
  let localVue, wrapper, store;
  beforeEach(async () => {
    localVue = createLocalVue();
    //Install a filter on localVue
    localVue.filter("setCommas", function (value) {
      try {
        value = value.toFixed(2);
      } catch (error) {}
      return String(value).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    });
    //setup vuex
    localVue.use(Vuex);
    const storeObj = await loadFakedStore();
    storeObj.modules.accountMangementModule.state.account = {
      wallet: 100,
      profitWallet: 50,
    };
    store = new Vuex.Store(storeObj);
    store.dispatch = jest.fn(() => {
      return new Promise((resolve, reject) => resolve(1));
    });
    wrapper = mount(Wallet, {
      localVue,
      attachTo: document.body,
      store,
    });
  });
  afterEach(() => {
    wrapper.destroy();
    jest.resetAllMocks();
  });
  it("Toggles the display of a modal when the deposit button is clicked", async () => {
    await fireEvent.click(screen.getByTestId("depositBtn"));
    const mainWalletInputModal = screen.getByText(
      "please specify how much you want to deposit"
    );
    expect(mainWalletInputModal).toBeInTheDocument();
    await fireEvent.click(screen.getByTestId("closeModalButton"));
    expect(mainWalletInputModal).not.toBeInTheDocument();
  });
  it("Toggles the display of a modal when the withdraw button is clicked", async () => {
    await fireEvent.click(screen.getByTestId("withdrawBtn"));
    const profitWalletInputModal = screen.getByText(
      "please specify how much you want to withdraw"
    );
    expect(profitWalletInputModal).toBeInTheDocument();
    await fireEvent.click(screen.getByTestId("closeModalButton"));
    expect(profitWalletInputModal).not.toBeInTheDocument();
  });
  it("has a method that does not dispatch store actions if it receives an event object with a false repsonse property", async () => {
    await fireEvent.click(screen.getByTestId("depositBtn"));
    const mainWalletInputModal = screen.getByText(
      "please specify how much you want to deposit"
    );
    wrapper.vm.fundWallet({ response: false });
    expect(store.dispatch).not.toHaveBeenCalledTimes(2);
    await wrapper.vm.$nextTick();
    expect(mainWalletInputModal).not.toBeInTheDocument();
  });
  it("has a method that does dispatches a store action if it receives an event object with a true repsonse property", async () => {
    await fireEvent.click(screen.getByTestId("depositBtn"));
    const mainWalletInputModal = screen.getByText(
      "please specify how much you want to deposit"
    );
    wrapper.vm.fundWallet({ response: true, value: 5 });
    await wrapper.vm.$nextTick();
    expect.assertions(3); //makes sure all asssertions are run
    expect(store.dispatch.mock.calls[1]).toEqual(["performTransaction", 5]);
    expect(store.dispatch.mock.calls[2]).toEqual(
      expect.arrayContaining(["updateCardTransactionLog"])
    );
    //fund wallet queues the closing of the modal as a micro task(promise), hence it will not be caught in normal flow
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(expect(mainWalletInputModal).not.toBeInTheDocument());
      }, 500);
    });
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
