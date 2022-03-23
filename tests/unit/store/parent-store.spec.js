describe("Parent store is where the modularized store is arranged. It consists of several store modules, however it has its own functions (mutations & getters)", function () {
  let store, ctx;
  beforeEach(async () => {
    store = (await import("../../../src/store/index.js")).storeData;
    ctx = {
      dispatch: jest.fn(),
      commit: jest.fn(),
      state: {
        storeError: "",
        authStoreModule: {},
        accountMangementModule: {},
        stockMangementModule: {},
      },
    };
  });
  afterEach(() => {
    store.state = {
      storeError: "",
      authStoreModule: {},
      accountMangementModule: {},
      stockMangementModule: {},
    };
    jest.resetAllMocks();
  });
  it("has a throw state error mutation that generates an error field on the state object", () => {
    store.mutations.throwStoreError(store.state, "Test Error");
    expect(store.state.storeError).toBe("Test Error");
  });
  it("has a clear state error mutation that sets an error field on the state object to null", () => {
    store.mutations.clearError(store.state);
    expect(store.state.storeError).toBeNull();
  });
  it("has a store email mutation that saves the value passed to it to the store", () => {
    store.mutations.storeEmail(store.state, "kasope@gmail.com");
    expect(store.state.email).toBe("kasope@gmail.com");
  });
});
