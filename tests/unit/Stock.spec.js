import { createLocalVue, mount } from "@vue/test-utils";
import { fireEvent, screen } from "@testing-library/vue";
import Stock from "@/components/Stock.vue";

describe("Stock is a component that represents a single stock from the stcck market", () => {
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
    wrapper.destroy();
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
    await fireEvent.input(screen.getByTestId("purchaseInput"), {
      target: {
        value: "2",
      },
    });
    expect(screen.getByText("$", { exact: false })).toHaveTextContent("40.00");
  });
});
