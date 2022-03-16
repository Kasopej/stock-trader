import { createLocalVue, mount } from "@vue/test-utils";
import { fireEvent, screen } from "@testing-library/vue";
import Register from "@/views/Register.vue";

describe("Register is a component that allows a user to add an authentication record", function () {
  let localVue, wrapper, mockStore;
  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn(),
    };
    localVue = createLocalVue();
    wrapper = mount(Register, {
      localVue,
      attachTo: document.body,
      mocks: {
        $store: mockStore,
      },
      stubs: ["router-link"],
    });
  });
  afterEach(() => {
    wrapper.destroy();
    jest.resetAllMocks();
  });
  it("does not dispatch a store register action on form submit if the form is not validated or terms are agreed to", async () => {
    const submitBtn = screen.getByText("Register");
    await fireEvent.click(submitBtn);
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });
  it("dispatches a store register action if the form is validated & terms are agreed to", async () => {
    wrapper.vm.termsAreAgreed = true;
    const submitBtn = screen.getByText("Register");
    await fireEvent.click(submitBtn);
    expect(mockStore.dispatch).toHaveBeenCalled();
  });
});
