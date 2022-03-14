import { createLocalVue, mount } from "@vue/test-utils";
import { fireEvent, screen, render } from "@testing-library/vue";
import Vuex from "vuex";
import PortfolioAsset from "@/components/PortfolioAsset.vue";

describe("PortfolioAsset is the component that represents a single asset of a user'sportfolio", function () {
  let localVue, wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.filter("setCommas", function (value) {
      try {
        value = value.toFixed(2);
      } catch (error) {
        console.log(error);
      }
      return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    });
    wrapper = mount(PortfolioAsset, {
      propsData: {
        asset: {
          assetDetails: {
            ticker: "AAPL",
            name: "Apple Coporation",
            currentPrice: 20,
            priceChange: 0.5,
          },
          quantity: 2,
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

  it("renders the right values", async () => {
    const moneyIndicatorElements = await screen.findAllByText("$", {
      exact: false,
    });
    expect(screen.getByTestId("purchaseInput")).toHaveValue(0);
    expect(screen.getByTestId("saleInput")).toHaveValue(0);
    expect(moneyIndicatorElements[0]).toHaveTextContent("40.00");
  });
  it("rejects input values less than zero (converts string to a number ia v-bind)", async () => {
    await fireEvent.input(screen.getByTestId("purchaseInput"), {
      target: {
        value: "-1",
      },
    });
    expect(screen.getByTestId("purchaseInput")).toHaveValue(0);
    await fireEvent.input(screen.getByTestId("saleInput"), {
      target: {
        value: "-1",
      },
    });
    expect(screen.getByTestId("saleInput")).toHaveValue(0);
  });
  it("updates purchase input values equal to or greater than zero (converts string to a number ia v-bind)", async () => {
    const moneyIndicatorElements = await screen.findAllByText("$", {
      exact: false,
    });

    await fireEvent.input(screen.getByTestId("purchaseInput"), {
      target: {
        value: "10",
      },
    });
    expect(screen.getByTestId("purchaseInput")).toHaveValue(10);
    expect(moneyIndicatorElements[1]).toHaveTextContent("200.00");
  });
  it("updates sale input values greater than zero but not greater than the available quantity of assets (converts string to a number ia v-bind)", async () => {
    const moneyIndicatorElements = await screen.findAllByText("$", {
      exact: false,
    });

    await fireEvent.input(screen.getByTestId("saleInput"), {
      target: {
        value: "3",
      },
    });
    expect(screen.getByTestId("saleInput")).toHaveValue(2);
    expect(moneyIndicatorElements[2]).toHaveTextContent("40.00");
  });
  it("dispatches store actions on purchase confirmation", async () => {
    wrapper.destroy(); // destroys wrapper mounted in beforeEach hook
    localVue.use(Vuex);
    const storeObj = await loadFakedStore();
    const store = new Vuex.Store(storeObj);
    wrapper = mount(PortfolioAsset, {
      propsData: {
        asset: {
          assetDetails: {
            ticker: "AAPL",
            currentPrice: 20,
            priceChange: 0.5,
          },
          quantity: 2,
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
    await wrapper.vm.buyStockFromAsset({ response: true });
    expect(
      storeObj.modules.accountMangementModule.actions.performTransaction.mock
        .calls[0][1]
    ).toBe(-40);
  });
  it("dispatches store actions on sale confirmation", async () => {
    wrapper.destroy(); // destroys wrapper mounted in beforeEach hook
    localVue.use(Vuex);
    const storeObj = await loadFakedStore();
    const store = new Vuex.Store(storeObj);
    const asset = {
      asset: {
        assetDetails: {
          ticker: "AAPL",
          currentPrice: 20,
          priceChange: 0.5,
        },
        quantity: 2,
      },
    };
    wrapper = mount(PortfolioAsset, {
      propsData: {
        ...asset,
      },
      localVue,
      store,
      attachTo: document.body,
    });
    wrapper.vm.$store.state.accountMangementModule.account = { wallet: 50 };
    await fireEvent.input(screen.getByTestId("saleInput"), {
      target: {
        value: "1",
      },
    });
    await wrapper.vm.sellStock({ response: true });
    expect(
      storeObj.modules.stockMangementModule.actions.updatePortfolioFromAsset
        .mock.calls[0][1]
    ).toStrictEqual({ ...asset, quantity: -1 });
  });
  it("toggles the display of a confirmation modal", async () => {
    await fireEvent.input(screen.getByTestId("purchaseInput"), {
      target: {
        value: "2",
      },
    });
    await fireEvent.click(screen.getByText("Buy"));
    const confirmModal = screen.getByText(`buy Apple Coporation share?`);
    expect(confirmModal).toBeInTheDocument();
    await wrapper.vm.closeModal("confirmBuyStock");
    expect(confirmModal).not.toBeInTheDocument();
  });
  it("toggles the display of a confirmation modal", async () => {
    await fireEvent.input(screen.getByTestId("saleInput"), {
      target: {
        value: "2",
      },
    });
    await fireEvent.click(screen.getByText("Sell"));
    const confirmModal = screen.getByText(`sell Apple Coporation stock?`);
    expect(confirmModal).toBeInTheDocument();
    await wrapper.vm.closeModal("confirmSellStock");
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
