<template>
  <div class="container-fluid">
      <Stock v-for="stock in stocks" :key="stock.id"></Stock>
  </div>
</template>

<script>
import Stock from "@/components/Stock.vue";
export default {
    data() {
        return {
            stocks: []
        }
    },
    components: {
        Stock,
    }
}
</script>

<style>
    
</style>