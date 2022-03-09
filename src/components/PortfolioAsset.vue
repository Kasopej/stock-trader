<template>
  <div class="card asset my-2">
    <div class="card-header d-flex justify-content-between">
      <span>{{ assetDetails.ticker }}</span>
      <span
        >trend:
        <span :style="percentageStyle"
          >{{ assetDetails.priceChange.toFixed(2) }}%</span
        ></span
      >
    </div>
    <div class="card-body">
      <p>{{ assetDetails.name }}</p>
      <hr>
      <p class="">No. of my shares: <span class="badge bg-secondary">{{asset.quantity}}</span></p>
      <p class="">Current value: <span class="badge bg-secondary">{{asset.quantity * assetDetails.currentPrice}}</span></p>
    </div>
    <!-- Card footer -->
    <div class="card-footer d-flex justify-content-between p-0">
      <div class="text-center border-end border-dark p-2">
        <input
        class="stockQtyInput"
        type="number"
        name="stockQty"
        v-model="qtyToPurchase"
      />
      <p class="m-0 p-0">
        {{ qtyToPurchase }} x {{ assetDetails.currentPrice }} = ${{
          sharePurchaseCost | setCommas
        }}
      </p>
      <a
        class="btn btn-sm btn-success stockPurchaseBtn"
        @click="showModal('confirmBuyStock')"
      >
        Buy
      </a>
      </div>
      <div class="text-center p-2">
        <input
        class="stockQtyInput"
        type="number"
        name="stockQty"
        v-model="qtyToSell"
      />
      <p class="m-0 p-0">
        {{ qtyToSell }} x {{ assetDetails.currentPrice }} = ${{
          assetSaleValue | setCommas
        }}
      </p>
      <a
        class="btn btn-sm btn-success stockPurchaseBtn"
        @click="showModal('confirmBuyStock')"
      >
        Sell
      </a>
      </div>
    </div>

    <!-- Modal -->
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
            <p>Buy {{ assetDetails.name }} stock?</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal('confirmBuyStock')"
            >
              No
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="buyStock(sharePurchaseCost)"
            >
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
import { mapActions, mapState } from "vuex";
export default {
  mixins: [modalControlMixin],
  props: {
    asset: {
      type: Object,
      default: ()=>({})
    }
  },
  data() {
    return {
      qtyToPurchase: 0, qtyToSell: 0
    }
  },
  computed: {
    ...mapState({ wallet: (state) => state.accountMangementModule.account.wallet }),
    assetDetails(){
      return this.asset.assetDetails
    },
    sharePurchaseCost() {
      return this.assetDetails.currentPrice * this.qtyToPurchase;
    },
    assetSaleValue(){
      return this.assetDetails.currentPrice * this.qtyToSell;
    },
    percentageStyle() {
      return {
        color: this.assetDetails.priceChange > 0 ? "green" : "red",
      };
    },
  },
  methods: {
    ...mapActions([
      "performTransaction",
      "updatePortfolioFromAsset",
      "fetchUserAccount",
    ]),
    buyStock(cost) {
      if (this.wallet >= cost) {
        console.log("performing transaction");
        this.performTransaction(cost)
          .then(() => this.updatePortfolioFromAsset({asset:this.asset, quantity: +this.qtyToPurchase}))
          .then(() => this.fetchUserAccount())
          .then(() => {
            this.qtyToPurchase = 0;
            this.closeModal("confirmBuyStock");
            });
      }
    },
  },
};
</script>

<style scoped>
.card-header {
  background-color: rgb(224, 228, 27);
  color: rgb(0, 0, 0);
  font-weight: 5px;
}
.card-body {
  position: relative;
}
</style>
