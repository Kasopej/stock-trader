<template>
  <div class="card stock my-2">
    <div class="card-header d-flex justify-content-between">
      <span>{{ share.ticker }}</span>
      <span
        >trend:
        <span :style="percentageStyle"
          >{{ share.priceChange.toFixed(2) }}%</span
        ></span
      >
    </div>
    <div class="card-body">
      <p>{{ share.name }}</p>
      <input
        class="stockQtyInput"
        type="number"
        name="stockQty"
        v-model="qtyToPurchase"
      />
      <p class="m-0 p-0">
        {{ qtyToPurchase }} x {{ share.currentPrice }} = ${{
          sharePurchaseCost
        }}
      </p>
      <a
        class="btn btn-sm btn-success stockPurchaseBtn d-block mr-auto"
        @click="showModal('confirmBuyStock')"
      >
        Buy
      </a>
    </div>
    <div v-if="shows.confirmBuyStock" class="myModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmation</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="closeModal('confirmBuyStock')"
            ></button>
          </div>
          <div class="modal-body">
            <p>Buy {{ share.name }} stock?</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal('confirmBuyStock')"
            >
              No
            </button>
            <button type="button" class="btn btn-primary" @click="confirm">
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { modalControlMixin } from "../mixins/mixins";
export default {
  mixins: [modalControlMixin],
  props: {
    share: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      qtyToPurchase: 0,
    };
  },
  computed: {
    sharePurchaseCost() {
      return this.share.currentPrice * this.qtyToPurchase;
    },
    percentageStyle() {
      return {
        color: this.share.priceChange > 0 ? "green" : "red",
      };
    },
  },
  methods: {
    confirm() {
      console.log("log something");
      this.closeModal("confirmBuyStock");
    },
  },
};
</script>

<style scoped>
.card-header {
  background-color: rgb(155, 219, 155);
  color: rgb(19, 77, 19);
  font-weight: 5px;
}
.card-body {
  position: relative;
}

</style>
