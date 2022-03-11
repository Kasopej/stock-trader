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
        data-testid="purchaseInput"
        :value="qtyToPurchase"
        @input="updateQty($event, 'purchase')"
      />
      <p class="m-0 p-0">
        {{ qtyToPurchase }} x {{ share.currentPrice | setCommas }} = ${{
          sharePurchaseCost | setCommas
        }}
      </p>
      <button
        class="btn btn-sm btn-success stockPurchaseBtn w-100"
        :disabled="!qtyToPurchase"
        @click="showModal('confirmBuyStock')"
      >
        Buy
      </button>
    </div>
    <ConfirmationModal
      v-if="modals.confirmBuyStock.show"
      :text="modals.confirmBuyStock.text"
      :customEventName="modals.confirmBuyStock.customEventName"
      @[modals.confirmBuyStock.customEventName]="buyStock"
    ></ConfirmationModal>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ConfirmationModal from "./reused-components/ConfirmationModal.vue";
import { stockTransactionActionMixin } from "../mixins/mixins";
export default {
  mixins: [stockTransactionActionMixin],
  components: { ConfirmationModal },
  props: {
    share: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      qtyToPurchase: 0,
      modals: {
        confirmBuyStock: {
          text: `buy ${this.share.name} stock?`,
          customEventName: "buyStock",
          show: false,
        },
      },
    };
  },
  computed: {
    ...mapState({
      wallet: (state) => state.accountMangementModule.account.wallet,
    }),
    sharePurchaseCost() {
      return this.share.currentPrice * this.qtyToPurchase;
    },
    percentageStyle() {
      return {
        color: this.share.priceChange >= 0 ? "green" : "red",
      };
    },
  },
  methods: {
    ...mapActions(["performTransaction", "fetchUserAccountUpdates"]),
    ...mapActions("stockMangementModule", ["updatePortfolioFromStock"]),
    showModal(name) {
      this.modals[name].show = true;
    },
    closeModal(name) {
      this.modals[name].show = false;
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
