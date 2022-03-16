import { createLocalVue, mount } from "@vue/test-utils";
import { fireEvent, screen } from "@testing-library/vue";
import Vuex from "vuex";
import Login from "@/views/Login.vue";

describe("Login is a component that allows a user to authenticate themselves by providing an email & password", function () {
  let localVue, wrapper, mockStore;
  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn(),
    };
    localVue = createLocalVue();
    wrapper = mount(Login, {
      localVue,
      attachTo: document.body,
      mocks: {
        $store: mockStore,
      },
      stubs: ["router-link"],
    });
  });
  it("dispatches a store login action when the form is submitted", async () => {
    const submitBtn = screen.getByText("Submit");
    await fireEvent.click(submitBtn);
    expect(mockStore.dispatch).toHaveBeenCalledWith("attemptLogin", {
      email: "",
      password: "",
    });
  });
});
