<template>
  <div class="card asset my-2">
    <div class="card-header">Featured</div>
    <div class="card-body">
      <input class="qtyToSell" type="number" name="qtyToSell" />
      <a href="#" class="btn btn-sm btn-warning sellAssetsBtn">Sell</a>
    </div>
  </div>
</template>

<script>
export default {};
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
