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
            @click="close(false)"
          ></button>
        </div>
        <div class="modal-body">
            <input type="number" 
            name="fund" id="fund" 
            :value="value"
            @input="updateQty($event)">
          <p>{{ text }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="close({response: true, value})" :disabled="!+value">
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
  },
    data() {
        return {
            value: 0
        }
    },
    methods: {
        updateQty(event) {
        if (+event.target.value < 0) {
            event.target.value = 0;
            return;
        }
        this.value = +event.target.value;
        },
        close(event) {
            this.$emit(this.customEventName, event);
        },
    },
}
</script>

<style>

</style>