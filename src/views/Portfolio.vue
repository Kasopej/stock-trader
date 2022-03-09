<template>
  <div class="container-fluid d-flex flex-wrap justify-content-between px-4">
    <portfolio-asset
      v-for="asset in portfolio"
      :key="asset.assetDetails.ticker"
      :asset="asset"
    ></portfolio-asset>
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
    ...mapState({ portfolio: (state) => state.accountMangementModule.account.portfolio })
  },
};
</script>

<style></style>
