<template>
  <div>
    <div class="d-flex justify-content-around p-4">
      <section class="card mainWallet">
        <div class="card-body">
          <h6 class="card-subtitle">Main Wallet</h6>
          <h4 class="card-title">$200,000</h4>
          <hr />
          <div class="px-2 d-flex justify-content-between">
            <div class="text-center">
              <button class="btn btn-success mx-2">
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <span class="d-block text-center">Withdraw</span>
            </div>
            <div class="text-center">
              <button class="btn btn-warning mx-2">
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <span class="d-block text-center">Withdraw</span>
            </div>
            <div class="text-center">
              <button class="btn btn-primary mx-2">
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <span class="d-block text-center">Withdraw</span>
            </div>
          </div>
        </div>
      </section>

      <section class="card profitWallet">
        <div class="card-body">
          <h6 class="card-subtitle">Profit Wallet</h6>
          <h4 class="card-title">$1,000</h4>
          <hr />
          <div class="px-2 d-flex justify-content-between">
            <div class="text-center">
              <button class="btn btn-success mx-2">
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <span class="d-block text-center">Withdraw</span>
            </div>
            <div class="text-center">
              <button class="btn btn-warning mx-2">
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <span class="d-block text-center">Withdraw</span>
            </div>
            <div class="text-center">
              <button class="btn btn-primary mx-2">
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <span class="d-block text-center">Withdraw</span>
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
export default {
  components: { TableBodyElement },
};
</script>

<style scoped>
section.card {
  flex: 0 1 40%;
}
.mainWallet span,
.profitWallet span {
  font-size: 12px;
}
</style>
