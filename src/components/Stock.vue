<template>
  <div class="card stock my-2">
    <div class="card-header">{{share.symbol}}</div>
    <div class="card-body">
      <input class="stockQtyInput" type="number" name="stockQty" />
      <a href="#" class="btn btn-sm btn-success stockPurchaseBtn">Buy</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ["share"]
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
