import axios from "axios";

let accountMangementModule, ctx;
describe("account-management-store is a store module that manages the account of the user, and all operations performed on the account", function () {
  beforeEach(async () => {
    accountMangementModule = (
      await import("../../../../src/store/modules/account-management-store.js")
    ).default;
    ctx = {
      dispatch: jest.fn(),
      commit: jest.fn(),
      state: { account: null },
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
  /* This section of test cases covers getters */
  it("has a name getter that returns the name of the user extracting it from the email. If no email has been set, it returns an empty string", () => {
    expect(
      accountMangementModule.getters.name(accountMangementModule.state)
    ).toBe("");
  });
  it("has a name getter that returns the name of the user extracting it from the email. If email has been set, it returns the string from the beginning to the character before the '@' sign", () => {
    accountMangementModule.state.account = {
      email: "kasopej@gmail.com",
    };
    expect(
      accountMangementModule.getters.name(accountMangementModule.state)
    ).toBe("kasopej");
  });
  it("has a wallet getter that returns the value of the user's wallet. If the account has not been set, it returns undefined", () => {
    expect(
      accountMangementModule.getters.wallet(accountMangementModule.state)
    ).toBeUndefined();
  });
  it("has a wallet getter that returns the value of the user's wallet.", () => {
    accountMangementModule.state.account = {
      wallet: 100,
    };
    expect(
      accountMangementModule.getters.wallet(accountMangementModule.state)
    ).toBe(100);
  });
  it("has a profit getter that returns the value of the user's profit wallet. If the account has not been set, it returns undefined", () => {
    expect(
      accountMangementModule.getters.profit(accountMangementModule.state)
    ).toBeUndefined();
  });
  it("has a profit getter that returns the value of the user's profit wallet.", () => {
    accountMangementModule.state.account = {
      profitWallet: 100,
    };
    expect(
      accountMangementModule.getters.profit(accountMangementModule.state)
    ).toBe(100);
  });
  /* This section of test cases covers actions */
  it("has a createNewUserAccount action that posts a new user account to the users database. If post is successful, it dispatches store actions", async () => {
    axios.post.mockResolvedValue(1);
    await accountMangementModule.actions.createNewUserAccount(ctx, {
      email: "kasopej@gmail.com",
      password: "Kasopej",
    });
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(ctx.dispatch.mock.calls).toEqual([
      ["fetchUserAccount"],
      ["persistAuthData"],
    ]);
  });
  it("has a createNewUserAccount action that posts a new user account to the users database. If post is unsuccessful, it does not dispatch actions", async () => {
    axios.post.mockRejectedValue("test post error");
    await accountMangementModule.actions.createNewUserAccount(ctx, {
      email: "kasopej@gmail.com",
      password: "Kasopej",
    });
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(ctx.dispatch).not.toHaveBeenCalled();
  });
  it("has a fetchUserAccount that gets a user from the db. If it receives a user matching the logged in user, it commits the matching account and portfolio to the store", async () => {
    ctx.rootState.email = "kasopej@gmail.com";
    axios.get.mockResolvedValue({
      data: {
        abcdefg: {
          email: "kasopej@gmail.com",
          portfolio: [{ quantity: 10 }],
        },
      },
    });
    await accountMangementModule.actions.fetchUserAccount(ctx);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(ctx.commit.mock.calls).toEqual([
      ["stockMangementModule/setPortfolio", [{ quantity: 10 }]],
      [
        "storeUserAccount",
        {
          id: "abcdefg",
          email: "kasopej@gmail.com",
        },
      ],
      ["login"],
    ]);
  });
  it("has a fetchUserAccount that gets a user from the db. If it does not receives a user from the db matching the logged in user, it dispatches an action to logout the user", async () => {
    ctx.rootState.email = "kasopej@gmail.com";
    axios.get.mockResolvedValue({
      data: {
        abcdefg: {
          email: "marshall@gmail.com",
          portfolio: [{ quantity: 10 }],
        },
      },
    });
    await accountMangementModule.actions.fetchUserAccount(ctx);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(ctx.dispatch).toHaveBeenCalledWith("logout");
  });
  it("has a updateUserAccount action which patches the current user account on the DB with an update payload.", async () => {
    axios.patch.mockResolvedValue(1);
    ctx.state.account = { id: "abcdefg" };
    await accountMangementModule.actions.updateUserAccount(ctx, {
      wallet: 200,
    });
    expect(axios.patch).toHaveBeenCalled();
    expect(ctx.commit).toHaveBeenCalledTimes(1);
  });
  it("has a updateUserAccount action which patches the current user account on the DB with an update payload. But if the user account does not have an id token field, it does not execute the patch", () => {
    accountMangementModule.actions.updateUserAccount(ctx, { wallet: 200 });
    expect(axios.patch).not.toHaveBeenCalled();
    expect(ctx.commit).toHaveBeenCalledWith(
      "throwStoreError",
      "user not identified. Please refresh your page"
    );
  });
  it("has a fetchUserAccountUpdates action which fetches the user account on the DB after any updates have been carried out. But if the user account does not have an id token field, the action throws an error", async () => {
    try {
      await accountMangementModule.actions.fetchUserAccountUpdates(ctx);
    } catch (error) {
      expect(axios.get).not.toHaveBeenCalled();
      expect(ctx.commit).not.toHaveBeenCalled();
    }
  });
  it("has a performTransaction action which commits a mutation to modify the user's wallet, then dispatches an action to patch this change into the DB", async () => {
    ctx.state.account = { wallet: 100 };
    await accountMangementModule.actions.performTransaction(ctx, 100);
    expect(ctx.commit).toHaveBeenCalled();
    expect(ctx.dispatch).toHaveBeenCalled();
  });
  it("has a performTransactionOnProfitWallet action which commits a mutation to modify the user's profit wallet, then dispatches an action to patch this change into the DB", async () => {
    ctx.state.account = { profitWallet: 100 };
    await accountMangementModule.actions.performTransactionOnProfitWallet(
      ctx,
      100
    );
    expect(ctx.commit).toHaveBeenCalled();
    expect(ctx.dispatch).toHaveBeenCalled();
  });
  it("has a updateCardTransactionLog action which commits a mutation to modify the user's transaction records, then dispatches an action to patch this change into the DB", async () => {
    ctx.state.account = { cardTransactionsLog: [] };
    await accountMangementModule.actions.updateCardTransactionLog(ctx, {
      location: "profit wallet",
    });
    expect(ctx.commit).toHaveBeenCalled();
    expect(ctx.dispatch).toHaveBeenCalled();
  });
  /* This section of test cases covers mutations */
  it("has a storeUserAccount mutation that saves a user account payload received from the DB into the application store. It adds an empty ransaction log array if no logs are in the payload", () => {
    expect(accountMangementModule.state.account).toBeNull();
    accountMangementModule.mutations.storeUserAccount(
      accountMangementModule.state,
      { id: "abcdefg", email: "kasopej@gmail.com" }
    );
    expect(accountMangementModule.state.account).toEqual(
      expect.objectContaining({ id: "abcdefg", email: "kasopej@gmail.com" })
    );
    expect(
      "cardTransactionsLog" in accountMangementModule.state.account
    ).toBeTruthy();
  });
  it("has a updateWallet mutation that updates (increment or decrement) the user's wallet", () => {
    accountMangementModule.state.account = {
      wallet: 50,
    };
    accountMangementModule.mutations.updateWallet(
      accountMangementModule.state,
      -10
    );
    expect(accountMangementModule.state.account.wallet).toBe(40);
  });
  it("has a setProfitWallet mutation that sets the profit wallet. The profit payload for this action comes from calculating the profit value of the assets", () => {
    accountMangementModule.state.account = {
      profitWallet: 0,
    };
    accountMangementModule.mutations.setProfitWallet(
      accountMangementModule.state,
      100
    );
    expect(accountMangementModule.state.account.profitWallet).toBe(100);
  });
  it("has a updateProfitWallet mutation that updates the profit wallet. The update payload comes from a transaction on the profit wallet", () => {
    accountMangementModule.state.account = {
      profitWallet: 100,
    };
    accountMangementModule.mutations.updateProfitWallet(
      accountMangementModule.state,
      50
    );
    expect(accountMangementModule.state.account.profitWallet).toBe(150);
  });
  it("has a clearAccount mutation that sets the account to null", () => {
    accountMangementModule.state.account = {
      profitWallet: 100,
    };
    expect(accountMangementModule.state.account).not.toBeNull();
    accountMangementModule.mutations.clearAccount(accountMangementModule.state);
    expect(accountMangementModule.state.account).toBeNull();
  });
});
