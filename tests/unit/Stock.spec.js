import { createLocalVue, mount } from "@vue/test-utils";
import { fireEvent, screen } from "@testing-library/vue";
import Vuex from "vuex";
import Stock from "@/components/Stock.vue";

describe("Stock is a component that represents a single stock from the stcck market", () => {
  let localVue, wrapper;

  beforeEach(async () => {
    localVue = createLocalVue();
    localVue.filter("setCommas", function (value) {
      try {
        value = value.toFixed(2);
      } catch (error) {
        console.log(error);
      }
      return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    });

    wrapper = mount(Stock, {
      propsData: {
        share: {
          currentPrice: 20,
          priceChange: 0.5,
        },
      },
      localVue,
      attachTo: document.body,
    });
  });
  afterEach(() => {
    wrapper.destroy();
    jest.resetAllMocks();
  });
  it("displays the correct initial value for the purchase quantity input", () => {
    expect(screen.getByTestId("purchaseInput")).toHaveValue(0);
  });
  it("rejects input values less than zero (converts string to a number ia v-bind)", async () => {
    await fireEvent.input(screen.getByTestId("purchaseInput"), {
      target: {
        value: "-1",
      },
    });
    expect(screen.getByTestId("purchaseInput")).toHaveValue(0);
  });
  it("updates input values equal to or greater than zero (converts string to a number ia v-bind)", async () => {
    await fireEvent.input(screen.getByTestId("purchaseInput"), {
      target: {
        value: "1",
      },
    });
    expect(screen.getByTestId("purchaseInput")).toHaveValue(1);
  });
  it("renders the cost of the share purchase quantity", async () => {
    await fireEvent.input(screen.getByTestId("purchaseInput"), {
      target: {
        value: "2",
      },
    });
    expect(screen.getByText("$", { exact: false })).toHaveTextContent("40.00");
  });
  it("renders the cost of the share purchase quantity", async () => {
    await fireEvent.input(screen.getByTestId("purchaseInput"), {
      target: {
        value: "2",
      },
    });
    expect(screen.getByText("$", { exact: false })).toHaveTextContent("40.00");
  });
  it("dispatches store actions on confirmation", async () => {
    wrapper.destroy(); // destroys wrapper mounted in beforeEach hook
    localVue.use(Vuex);
    const storeObj = await loadFakedStore();
    const store = new Vuex.Store(storeObj);
    wrapper = mount(Stock, {
      propsData: {
        share: {
          currentPrice: 20,
          priceChange: 0.5,
        },
      },
      localVue,
      store,
      attachTo: document.body,
    });
    wrapper.vm.$store.state.accountMangementModule.account = { wallet: 50 };
    await fireEvent.input(screen.getByTestId("purchaseInput"), {
      target: {
        value: "2",
      },
    });
    await wrapper.vm.buyStock({ response: true });
    expect(
      storeObj.modules.accountMangementModule.actions.performTransaction.mock
        .calls[0][1]
    ).toBe(-40);
  });
  it("toggles the display of a confirmation modal", async () => {
    await fireEvent.input(screen.getByTestId("purchaseInput"), {
      target: {
        value: "2",
      },
    });
    await fireEvent.click(screen.getByText("Buy"));
    const confirmModal = screen.getByTestId("purchaseConfirmationModal");
    expect(confirmModal).toBeInTheDocument();
    await wrapper.vm.closeModal("confirmBuyStock");
    expect(confirmModal).not.toBeInTheDocument();
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
