<template>
  <div id="app">
    <Header></Header>
    <router-view />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  data() {
    return {};
  },
  components: {
    Header,
  },
};
</script>

<style>
#app{padding: 24px 35px;}

/* Common styles for Stock & PortfolioAsset components */
.asset, .stock{
        flex-basis: 30%; flex-grow: 0;
    }
.stockPurchaseBtn, .sellAssetsBtn{position: absolute;}
.stockQtyInput, .qtyToSell{left: 0px; width: 65%;}
.stockPurchaseBtn, .sellAssetsBtn{right: 1rem;}
</style>
