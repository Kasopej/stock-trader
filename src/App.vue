<template>
  <div id="app" class="d-flex">
    <Sidebar></Sidebar>
    <main>
      <Header></Header>
      <router-view />
    </main>
  </div>
</template>

<script>
import Header from "@/components/navigation-components/Header.vue";
import { mapActions, mapGetters } from "vuex";
import Sidebar from "./components/navigation-components/Sidebar.vue";
export default {
  components: {
    Header,
    Sidebar,
  },
  methods: {
    ...mapActions([
      "attemptLoginOnLoad",
      "stockMangementModule/getSymbolsFromMarket",
    ]),
    closeSignOut() {
      this.closeSignOutModal = true;
    },
    fetchShares(checkAuthenticationBeforeFetch) {
      if (!this.areAllSharesPricesAvailable) {
        if (checkAuthenticationBeforeFetch) {
          if (this.isAuthenticated) {
            this["stockMangementModule/getSymbolsFromMarket"]();
            return;
          } else return;
        }
        this["stockMangementModule/getSymbolsFromMarket"]();
      }
    },
  },

  created() {
    this.attemptLoginOnLoad();
    //just while I am persisting my full store because of API issues
    this.fetchShares(true);
  },
  watch: {
    ["$store.state.authStoreModule.authenticated"]() {
      if (this.$store.state.authStoreModule.authenticated) {
        this.$router.push("/home");
        this.fetchShares(false);
      } else {
        this.$router.push("/login");
      }
    },
  },
  computed: {
    ...mapGetters("stockMangementModule", ["areAllSharesPricesAvailable"]),
    ...mapGetters(["isAuthenticated"]),
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
/*
.stockPurchaseBtn,
.sellAssetsBtn {
}
*/
.stockQtyInput,
.qtyToSell {
  left: 0px;
  width: 65%;
}
.myModal {
  position: fixed;
  top: 20%;
  left: 15%;
  z-index: 1055;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
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
