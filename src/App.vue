<template>
  <div id="app" class="d-flex">
    <Sidebar @openSignOut="closeSignOutModal = false"></Sidebar>
    <main>
      <Header></Header>
      <router-view />
      <sign-out-modal
        v-if="!closeSignOutModal"
        @close="closeSignOutModal = true"
      ></sign-out-modal>
    </main>
  </div>
</template>

<script>
import Header from "@/components/navigation-components/Header.vue";
import { mapActions } from "vuex";
import Sidebar from "./components/navigation-components/Sidebar.vue";
export default {
  data() {
    return {
      closeSignOutModal: true,
    };
  },
  components: {
    Header,
    Sidebar,
  },
  methods: {
    ...mapActions([
      "attemptLoginOnLoad",
      "stockMangementModule/getSymbolsFromMarket",
      "fetchUserAccount",
    ]),
    closeSignOut() {
      this.closeSignOutModal = true;
    },
  },

  created() {
    //just while I am persisting my full store because of API issues
    if (this.$store.state.authStoreModule.authenticated) {
      this.$router.push("/home").then(() => {
        this["stockMangementModule/getSymbolsFromMarket"]();
        this.fetchUserAccount();
      });
    } else this.attemptLoginOnLoad();
  },

  watch: {
    ["$store.state.authStoreModule.authenticated"]() {
      console.log("auth changed");
      if (this.$store.state.authStoreModule.authenticated) {
        this.$router.push("/home");
        this["stockMangementModule/getSymbolsFromMarket"]();
      } else this.$router.push("/login");
    },
  },
};
</script>

<style>
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
}
.stockQtyInput,
.qtyToSell {
  left: 0px;
  width: 65%;
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
