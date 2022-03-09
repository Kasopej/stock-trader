<template>
  <div v-if="areAllSharesPricesAvailable" class="container-fluid d-flex flex-wrap justify-content-between px-4">
    <Stock v-for="share in shares" :key="share.symbol" :share="share"></Stock>
  </div>
  <div v-else class="container-fluid d-flex flex-wrap justify-content-center px-4 align-items-center">
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
import Stock from "@/components/Stock.vue";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {};
  },
  components: {
    Stock,
  },
  computed: {
    ...mapState("stockMangementModule", ["shares"]),
    ...mapGetters("stockMangementModule", ["areAllSharesPricesAvailable"]),
  },
};
</script>

<style scoped></style>
