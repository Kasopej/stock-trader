<template>
  <div class="card stock my-2">
    <div class="card-header d-flex justify-content-between">
      <span>{{share.ticker}}</span>
      <span>trend: <span :style="percentageStyle">{{share.priceChange.toFixed(2)}}%</span></span>
    </div>
    <div class="card-body">
      <p>{{share.name}}</p>
      <input class="stockQtyInput" type="number" name="stockQty" v-model="qtyToPurchase" />
      <p class="m-0 p-0">{{qtyToPurchase}} x {{share.currentPrice}} = ${{sharePurchaseCost}}</p>
      <a href="#0" class="btn btn-sm btn-success stockPurchaseBtn d-block m-auto">Buy</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    share: {
      type: Object,
      default: ()=>({})
    }
  },
  data() {
    return {
      qtyToPurchase: 0
    }
  },
  computed: {
    sharePurchaseCost(){
      return (this.share.currentPrice * this.qtyToPurchase )
    },
    percentageStyle(){
      return ({
        color: (this.share.priceChange > 0) ? "green" : "red"
      })
    }
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
