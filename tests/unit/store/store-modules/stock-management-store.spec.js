import axios from "axios";

let stockMangementModule, ctx;
describe("stock-management-store is a store module that manages stocks and all stock transactions", function () {
  beforeEach(async () => {
    stockMangementModule = (
      await import("../../../../src/store/modules/stock-management-store.js")
    ).default;
    ctx = {
      dispatch: jest.fn(),
      commit: jest.fn(),
      state: {
        shares: [],
        portfolio: [],
      },
      rootState: {
        authStoreModule: { idToken: "qwertyuio" },
        stockMangementModule: {},
      },
    };
  });
  afterEach(() => {
    accountMangementModule.state.account = null;
    jest.resetAllMocks();
  });
  /* This section of test cases covers actions */
});
