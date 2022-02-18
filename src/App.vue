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
