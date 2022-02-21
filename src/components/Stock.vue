<template>
  <div class="card stock my-2">
    <div class="card-header">
        Featured
    </div>
    <div class="card-body">
        <input class="stockQtyInput" type="number" name="stockQty">
        <a href="#" class="btn btn-sm btn-success stockPurchaseBtn">Buy</a>
    </div>
</div>
</template>

<script>
export default {

}
</script>

<style scoped>
    .stock{
        flex-basis: 30%; flex-grow: 0;
    }
    .card-header{background-color: rgb(155, 219, 155); color: rgb(19, 77, 19); font-weight: 5px;}
    .card-body{position: relative;}
    .stockPurchaseBtn, .stockQty{position: absolute;}
    .stockQtyInput{left: 0px; width: 65%;}
    .stockPurchaseBtn{right: 1rem;}
</style>