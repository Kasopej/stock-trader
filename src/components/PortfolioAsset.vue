<template>
  <div class="card asset my-2 mx-3">
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
    <ConfirmationModal v-if="modals.confirmBuyStock.show" :text="modals.confirmBuyStock.text" :customEventName="modals.confirmBuyStock.customEventName" @[modals.confirmBuyStock.customEventName]="buyStock"></ConfirmationModal>

    
  </div>
</template>

<script>
//import { modalControlMixin } from "../mixins/mixins";
import { mapActions, mapState } from "vuex";
import ConfirmationModal from "./reused-components/ConfirmationModal.vue";
export default {
    props: {
        asset: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            qtyToPurchase: 0,
            qtyToSell: 0,
            modals: {
              confirmBuyStock: {
                text: `buy ${this.asset.assetDetails.name} stock?`, customEventName: "buyStock", show: false
              }
            }
        };
    },
    computed: {
        ...mapState({ wallet: (state) => state.accountMangementModule.account.wallet }),
        assetDetails() {
            return this.asset.assetDetails;
        },
        sharePurchaseCost() {
            return this.assetDetails.currentPrice * this.qtyToPurchase;
        },
        assetSaleValue() {
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
        buyStock(isConfirmed) {
          if(isConfirmed){
            if (this.wallet >= this.sharePurchaseCost) {
                console.log("performing transaction");
                this.performTransaction(this.sharePurchaseCost)
                    .then(() => this.updatePortfolioFromAsset({ asset: this.asset, quantity: +this.qtyToPurchase }))
                    .then(() => this.fetchUserAccount())
                    .then(() => {
                    this.qtyToPurchase = 0;
                    this.closeModal("confirmBuyStock");
                });
            }
          }
          else this.closeModal("confirmBuyStock");
        },
        showModal(name){
          this.modals[name].show = true;
        },
        closeModal(name){
          this.modals[name].show = false;
        }
    },
    components: { ConfirmationModal }
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
