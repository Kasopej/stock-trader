import { createLocalVue, mount } from "@vue/test-utils";
import { fireEvent, screen } from "@testing-library/vue";
import ConfirmationModal from "@/components/reused-components/ConfirmationModal.vue";

describe("ConfirmationModal is a component that provides the interface for a user to confirm a decision", function () {
  let localVue, wrapper;
  beforeEach(() => {
    localVue = createLocalVue();
    wrapper = mount(ConfirmationModal, {
      propsData: {
        customEventName: "testEvent",
        text: "Confirm test",
      },
      localVue,
      attachTo: document.body,
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });
  it("emits a custom event name (as specified in the prop). The event object contains information about if the user confirmed the decision", () => {
    return fireEvent.click(screen.getByText("Yes")).then(() => {
      expect(wrapper.emitted().testEvent[0][0]).toEqual(
        expect.objectContaining({ response: true })
      );
    });
  });
  it("emits a custom event name (as specified in the prop). The event object contains information about if the user aborted the decision", () => {
    return fireEvent.click(screen.getByText("No")).then(() => {
      expect(wrapper.emitted().testEvent[0][0]).toEqual(
        expect.objectContaining({ response: false })
      );
    });
  });
});
