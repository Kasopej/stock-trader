import { createLocalVue, mount } from "@vue/test-utils";
import { fireEvent, screen } from "@testing-library/vue";
import InputModal from "@/components/reused-components/InputModal.vue";

describe("InputModal is a component that allows the user to enter a number type input and confirm the entry", function () {
  let localVue, wrapper;
  beforeEach(() => {
    localVue = createLocalVue();
    wrapper = mount(InputModal, {
      propsData: {
        customEventName: "testModalEvent",
        text: "Enter your age",
        limit: 99,
        inputModal: true,
      },
      localVue,
      attachTo: document.body,
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });
  it("does not accept numbers more than the set limit (set by a prop)", async () => {
    const inputElement = screen.getByTestId("modalInput");
    await fireEvent.input(inputElement, {
      target: {
        value: "100",
      },
    });
    expect(inputElement).toHaveValue(99);
  });
  it("does not allow numbers less than zero", async () => {
    const inputElement = screen.getByTestId("modalInput");
    await fireEvent.input(inputElement, {
      target: {
        value: "-1",
      },
    });
    expect(inputElement).toHaveValue(0);
  });
  it("updates 'modalInputValue' data property if number entered is equal or greater than 0 but not more than the limit set", async () => {
    const inputElement = screen.getByTestId("modalInput");
    await fireEvent.input(inputElement, {
      target: {
        value: "10",
      },
    });
    expect(inputElement).toHaveValue(10);
    expect(wrapper.vm.modalInputValue).toBe(10);
  });
  it("emits an event if the close icon is clicked. The event object contains a response property with value of false", async () => {
    await fireEvent.click(screen.getByTestId("closeModalButton"));
    expect(wrapper.emitted().testModalEvent[0][0]).toEqual(
      expect.objectContaining({
        response: false,
      })
    );
  });
  it("emits an event if the confirm button is clicked. The event object contains a response property with value of true", async () => {
    const inputElement = screen.getByTestId("modalInput");
    await fireEvent.input(inputElement, {
      target: {
        value: "10",
      },
    });
    await fireEvent.click(screen.getByText("Confirm"));
    expect(wrapper.emitted().testModalEvent[0][0]).toEqual(
      expect.objectContaining({
        response: true,
        value: 10,
      })
    );
  });
});
