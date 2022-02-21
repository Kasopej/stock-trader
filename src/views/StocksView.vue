<template>
  <div class="container-fluid d-flex flex-wrap justify-content-between px-4">
      <Stock v-for="stock in stocks" :key="stock.id"></Stock>
  </div>
</template>

<script>
import Stock from "@/components/Stock.vue";
export default {
    data() {
        return {
            stocks: [{name: "Stock 1", id: 1}, {name: "Stock 1", id: 2}, {name: "Stock 1", id: 3}, {name: "Stock 1", id: 4}]
        }
    },
    components: {
        Stock,
    }
}
</script>

<style scoped>
    
</style>