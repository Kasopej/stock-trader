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
    return {};
  },
  components: {
    Header,
  },
};
</script>

<style scoped>
#app{padding: 24px 35px;}
</style>
