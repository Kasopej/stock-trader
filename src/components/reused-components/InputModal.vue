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
            :value="value"
            @input="updateQty($event)"
            data-testid="modalInput"
          />
          <p>{{ text }}</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            @click="close({ response: true, value: value })"
            :disabled="!value"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    customEventName: String,
    text: String,
    limit: Number,
  },
  data() {
    return {
      value: 0,
    };
  },
  methods: {
    updateQty(event) {
      if (+event.target.value < 0) {
        event.target.value = 0;
      } else if (+event.target.value > this.limit) {
        event.target.value = this.limit;
      }
      this.value = +event.target.value;
    },
    close(event) {
      this.$emit(this.customEventName, event);
    },
  },
};
</script>

<style></style>
