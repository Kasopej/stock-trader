<template>
  <div class="myModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirmation</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Should we sign you out?</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="close(false)"
          >
            No
          </button>
          <button type="button" class="btn btn-primary" @click="close(true)">
            Yes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignOutModal",
  methods: {
    close(response) {
      this.$emit("close", response);
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
