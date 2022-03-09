<template>
  <div v-if="portfolio.length" class="container-fluid d-flex flex-wrap justify-content-start px-4">
    <portfolio-asset
      v-for="asset in portfolio"
      :key="asset.assetDetails.ticker"
      :asset="asset"
    ></portfolio-asset>
  </div>
  <div v-else class="container-fluid vh-100 d-flex flex-wrap justify-content-center px-4 align-items-center">
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
import PortfolioAsset from "../components/PortfolioAsset.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {
    };
  },
  components: { PortfolioAsset },
  computed: {
    ...mapState("stockMangementModule", ["portfolio"]),
  },
};
</script>

<style></style>
