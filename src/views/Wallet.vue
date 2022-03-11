<template>
  <div>
    <div class="d-flex justify-content-around p-4">
      <section class="card mainWallet text-center">
        <div class="card-body">
          <h6 class="card-subtitle">Main Wallet</h6>
          <h4 class="card-title">${{ wallet | setCommas }}</h4>
          <hr />
          <div class="px-2 d-flex justify-content-center">
            <div class="w-100">
              <button
                class="btn btn-success w-50"
                @click="showModal('fundWalletDialog')"
              >
                <i class="fa-solid fa-arrow-right"></i>
              </button>
              <span class="d-block">Deposit</span>
            </div>
          </div>
        </div>
      </section>

      <section class="card profitWallet text-center">
        <div class="card-body">
          <h6 class="card-subtitle">Profit Wallet</h6>
          <h4 class="card-title">${{ profit | setCommas }}</h4>
          <hr />
          <div class="px-2 d-flex justify-content-center">
            <div class="w-100">
              <button
                class="btn btn-success w-50"
                @click="showModal('profitWalletDialog')"
              >
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <span class="d-block">Withdraw</span>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="py-4 px-5">
      <section class="transaction px-3">
        <h2 class="text-center">Transaction Log</h2>
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Action</th>
              <th scope="col">Amount</th>
              <th scope="col">Wallet</th>
            </tr>
          </thead>
          <tbody>
            <TableBodyElement
              v-for="(record, index) in cardTransactionLog"
              :key="record.timestamp"
              :record="record"
              :index="index"
            ></TableBodyElement>
          </tbody>
        </table>
      </section>
    </div>
    <InputModal
      v-if="modals.fundWalletDialog.show"
      :text="modals.fundWalletDialog.text"
      :customEventName="modals.fundWalletDialog.customEventName"
      @[modals.fundWalletDialog.customEventName]="fundWallet"
    ></InputModal>
    <InputModal
      v-if="modals.profitWalletDialog.show"
      :text="modals.profitWalletDialog.text"
      :customEventName="modals.profitWalletDialog.customEventName"
      @[modals.profitWalletDialog.customEventName]="debitProfitWallet"
    ></InputModal>
  </div>
</template>

<script>
import TableBodyElement from "../components/reused-components/TableBodyElement.vue";
import { mapGetters, mapState, mapActions } from "vuex";
import InputModal from "../components/reused-components/InputModal.vue";
export default {
  data() {
    return {
      modals: {
        fundWalletDialog: {
          text: `please specify how much you want to deposit`,
          customEventName: "fundWallet",
          show: false,
        },
        profitWalletDialog: {
          text: `please specify how much you want to withdraw`,
          customEventName: "debitProfitWallet",
          show: false,
        },
      },
    };
  },
  components: { TableBodyElement, InputModal },
  computed: {
    ...mapGetters(["wallet", "profit"]),
    ...mapState({
      cardTransactionLog: (state) =>
        state.accountMangementModule.account.cardTransactionsLog,
    }),
  },
  methods: {
    ...mapActions([
      "performTransactionOnProfitWallet",
      "performTransaction",
      "fetchUserAccountUpdates",
      "updateCardTransactionLog",
    ]),
    ...mapActions("stockMangementModule", ["getHistoricalPriceDataForAssets"]),
    fundWallet(event) {
      if (event.response) {
        console.log("performing transaction");
        this.performTransaction(event.value)
          .then(() =>
            this.updateCardTransactionLog({
              timestamp: new Date().valueOf(),
              type: "Deposit",
              amount: event.value,
              location: "Main Wallet",
            })
          )
          .then(() => {
            this.qtyToPurchase = 0;
            this.closeModal("fundWalletDialog");
          });
      } else this.closeModal("fundWalletDialog");
    },
    debitProfitWallet(event) {
      if (event.response) {
        if (event.value <= this.profitWallet) {
          console.log("performing transaction");
          this.performTransactionOnProfitWallet(event.value * -1)
            .then(() =>
              this.updateCardTransactionLog({
                timestamp: new Date().valueOf(),
                type: "Withdrawal",
                amount: event.value,
                location: "Profit Wallet",
              })
            )
            .then(() => {
              this.closeModal("profitWalletDialog");
            });
        }
        this.closeModal("profitWalletDialog");
      } else this.closeModal("profitWalletDialog");
    },
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
section.card {
  flex: 0 1 40%;
}
.mainWallet span,
.profitWallet span {
  font-size: 15px;
}
</style>
