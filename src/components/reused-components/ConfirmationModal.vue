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
            @click="close({ response: false })"
          ></button>
        </div>
        <div class="modal-body">
          <p>{{ text }}</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="close({ response: false })"
          >
            No
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="close({ response: true })"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmationModal",
  props: {
    customEventName: String,
    text: String,
  },
  methods: {
    close(response) {
      this.$emit(this.customEventName, response);
    },
  },
};
</script>

<style scoped>
.myModal {
  position: fixed;
  top: 20%;
  left: 15%;
  z-index: 1055;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
}
</style>
