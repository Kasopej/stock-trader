<template>
  <div class="myModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirmation</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            data-testid="closeModalButton"
            @click="close({ response: false })"
          ></button>
        </div>
        <div class="modal-body">
          <input
            type="number"
            name="fund"
            id="fund"
            :value="modalInputValue"
            @input="updateQty($event)"
            data-testid="modalInput"
          />
          <p>{{ text }}</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            @click="close({ response: true, value: modalInputValue })"
            :disabled="!modalInputValue"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { numericalInputControlMixin } from "../../mixins/mixins";
export default {
  mixins: [numericalInputControlMixin],
  props: {
    customEventName: String,
    text: String,
    limit: Number,
    inputModal: Boolean,
  },
  data() {
    return {
      modalInputValue: 0,
    };
  },
  methods: {
    close(event) {
      this.$emit(this.customEventName, event);
    },
  },
};
</script>

<style></style>
