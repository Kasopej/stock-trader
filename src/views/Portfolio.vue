<template>
  <div class="container-fluid d-flex flex-wrap justify-content-between px-4">
    <portfolio-asset
      v-for="asset in portfolio"
      :key="asset.id"
    ></portfolio-asset>
  </div>
</template>

<script>
import PortfolioAsset from "../components/PortfolioAsset.vue";
export default {
  data() {
    return {
      portfolio: [
        { name: "Asset 1", id: 1 },
        { name: "Asset 1", id: 2 },
        { name: "Asset 1", id: 3 },
      ],
    };
  },
  components: { PortfolioAsset },
};
</script>

<style></style>
