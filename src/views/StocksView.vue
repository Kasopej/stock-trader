<template>
  <div
    v-if="areAllSharesPricesAvailable"
    class="container-fluid d-flex flex-wrap justify-content-between px-4"
  >
    <Stock v-for="share in shares" :key="share.symbol" :share="share"></Stock>
  </div>
  <div
    v-else
    class="container-fluid vh-100 d-flex flex-wrap flex-column justify-content-center px-4 align-items-center"
  >
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p class="mb-0">
      Stocks are loading from the stocks market. Please be patient
    </p>
    <p class="mt-0">
      If stocks are not loaded after 3 minutes, please
      <router-link to="/profile">sign out</router-link> and sign back in
    </p>
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
