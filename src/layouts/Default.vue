<template>
  <div class="d-flex">
    <Sidebar></Sidebar>
    <main>
      <Header></Header>
      <slot></slot>
      <SignOutModal v-if="false"></SignOutModal>
    </main>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
export default {
  components: {
    Header,
    Sidebar,
  },
};
</script>

<style lang="css" scoped>
#app {
  height: -webkit-fill-available;
  flex-wrap: nowrap;
}
/*#app aside{float: left; width: 20%; position: absolute; top: 0; bottom: 0;}*/
#app aside {
  flex-basis: 30%;
  min-height: 100vh;
}
#app main {
  flex-basis: 70%;
}

/* Common styles for Stock & PortfolioAsset components */
.asset,
.stock {
  flex-basis: 30%;
  flex-grow: 0;
}
.stockPurchaseBtn,
.sellAssetsBtn {
  position: absolute;
}
.stockQtyInput,
.qtyToSell {
  left: 0px;
  width: 65%;
}
.stockPurchaseBtn,
.sellAssetsBtn {
  right: 1rem;
}

@media (min-width: 992px) {
  #app aside {
    flex-basis: 20%;
    min-height: 100vh;
  }
  #app main {
    flex-basis: 80%;
  }
}
</style>
