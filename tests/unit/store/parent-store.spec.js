import axios from "axios";
describe("Parent store is where the modularized store is arranged. It consists of several store modules, however it has its own functions (mutations & getters)", function () {
  let mutations, state, ctx;
  beforeEach(() => {
    mutations = {
      throwStoreError(state, error) {
        state.storeError = error;
      },
      clearError(state) {
        state.storeError = null;
      },
      storeEmail(state, email) {
        state.email = email;
      },
    };
    state = {};
  });
  afterEach(() => {
    state = {};
  });
  it("has a throw state error mutation that generates an error field on the state object", () => {
    mutations.throwStoreError(state, "Test Error");
    expect(state.storeError).toBe("Test Error");
  });
  it("has a clear state error mutation that sets an error field on the state object to null", () => {
    mutations.clearError(state);
    expect(state.storeError).toBeNull();
  });
  it("has a store email mutation that saves the value passed to it to the store", () => {
    mutations.storeEmail(state, "kasope@gmail.com");
    expect(state.email).toBe("kasope@gmail.com");
  });
});
