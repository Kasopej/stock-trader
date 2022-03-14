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
});
