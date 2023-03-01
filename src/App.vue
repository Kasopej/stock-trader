<template>
  <div id="app" class="d-flex">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import DefaultLayout from "@/layouts/Default.vue";
import EmptyLayout from "@/layouts/Empty.vue";
const App = defineComponent({
  data() {
    return {};
  },
  components: {
    default: DefaultLayout,
    empty: EmptyLayout,
  },
  computed: {
    layout() {
      return this.$route.meta.layout || "default";
    },
  },
});

export default App;
</script>

<style></style>
