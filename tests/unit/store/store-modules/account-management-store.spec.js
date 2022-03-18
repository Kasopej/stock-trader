import axios from "axios";

//import cloneDeep from "lodash/cloneDeep";
let accountMangementModule, ctx;
describe("account-management-store is a store module that manages the account of the user, and all operations performed on the account", function () {
  beforeEach(async () => {
    accountMangementModule = (
      await import("../../../../src/store/modules/account-management-store.js")
    ).default;
    ctx = {
      dispatch: jest.fn(),
      commit: jest.fn(),
      rootState: {
        authStoreModule: {},
        accountMangementModule: {},
        stockMangementModule: {},
      },
    };
  });
  afterEach(() => {
    accountMangementModule.state.account = null;
    jest.resetAllMocks();
  });
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
  it("has a fetchUserAccount that gets a user from the db. If it receives a user matching the logged in user, it commits the matching account and portfolio to the store, as well as dispatching an action to calculate the user profit", async () => {
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
    expect(ctx.dispatch).toHaveBeenCalledWith(
      "stockMangementModule/calculateProfitFromPortfolio"
    );
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
    expect(ctx.dispatch).toHaveBeenCalledWith("logout");
  });
});
