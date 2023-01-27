<template>
  <div id="app" class="d-flex">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import DefaultLayout from "./layouts/Default.vue";
import EmptyLayout from "./layouts/Empty.vue";
import Header from "@/components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
export default {
  data() {
    return {};
  },
  components: {
    Header,
    Sidebar,
    default: DefaultLayout,
    empty: EmptyLayout,
  },
  computed: {
    layout() {
      return this.$route.meta.layout || "default";
    },
  },
};
</script>

<style></style>
