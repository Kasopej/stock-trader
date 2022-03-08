<template>
  <div class="container-fluid d-flex flex-wrap justify-content-between px-4">
    <Stock v-for="share in shares" :key="share.symbol" :share="share"></Stock>
  </div>
</template>

<script>
import Stock from "@/components/Stock.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  components: {
    Stock,
  },
  computed: {
    ...mapState("stockMangementModule", ["shares"]),
  },
};
</script>

<style scoped></style>
