import { createLocalVue, mount } from "@vue/test-utils";
import { fireEvent, screen } from "@testing-library/vue";
import Profile from "@/views/Profile.vue";

describe("Profile is the component for the user profile page", function () {
  let localVue, wrapper, mockStore;
  beforeEach(() => {
    localVue = createLocalVue();
    mockStore = {
      dispatch: jest.fn(),
      getters: {},
    };
    wrapper = mount(Profile, {
      localVue,
      attachTo: document.body,
      mocks: {
        $store: mockStore,
      },
    });
  });
  afterEach(() => {
    wrapper.destroy();
    jest.resetAllMocks();
  });
  it("Toggles the display of a confirmation modal", async () => {
    await fireEvent.click(screen.getByText("Sign Out"));
    const confirmModal = screen.getByText("Confirmation");
    expect(confirmModal).toBeInTheDocument();
    await wrapper.vm.closeModal("confirmSignout");
    expect(confirmModal).not.toBeInTheDocument();
  });
  it("has a method dispatches a store action to logout the user", () => {
    wrapper.vm.confirmLogout({ response: true });
    expect(mockStore.dispatch).toBeCalledWith("logout");
  });
});
