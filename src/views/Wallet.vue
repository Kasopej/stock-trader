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
              <button class="btn btn-success w-50" @click="makeWalletDeposit">
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
          <h4 class="card-title">${{ netGrowth | setCommas }}</h4>
          <hr />
          <div class="px-2 d-flex justify-content-center">
            <div class="w-100">
              <button class="btn btn-success w-50" @click="withdrawFromProfit">
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
          <TableBodyElement></TableBodyElement>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
import TableBodyElement from "../components/reused-components/TableBodyElement.vue";
import { mapGetters, mapState } from "vuex";
export default {
  components: { TableBodyElement },
  computed: {
    ...mapGetters("stockMangementModule", ["netGrowth"]),
    ...mapState({
      wallet: (state) => state.accountMangementModule.account.wallet,
    }),
  },
  methods: {
    makeWalletDeposit() {},
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
