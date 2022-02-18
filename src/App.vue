<template>
  <div id="app">
    <div id="nav">
      <header></header>
    </div>
    <router-view />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  data() {
    return {
      
    }
  },
  components: {
    Header,
  }
}
</script>

<style>

</style>
