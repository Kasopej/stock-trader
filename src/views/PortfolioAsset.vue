<template>
  <div class="card asset my-2">
        <div class="card-header">
            Featured
        </div>
        <div class="card-body">
            <input class="qtyToSell" type="number" name="qtyToSell">
            <a href="#" class="btn btn-sm btn-warning sellAssetsBtn">Buy</a>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
    .asset{
        flex-basis: 30%; flex-grow: 0;
    }
    .card-header{background-color: rgb(224, 228, 27); color: rgb(0, 0, 0); font-weight: 5px;}
    .card-body{position: relative;}
    .sellAssetsBtn{position: absolute;}
    .qtyToSell{left: 0px; width: 65%;}
    .sellAssetsBtn{right: 1rem;}
</style>