<template>
  <div
    class="home d-flex flex-wrap justify-content-lg-between justify-content-around px-5 py-3"
  >
    <div
      class="homePane border rounded my-4"
      @mouseenter="addHoverStyle"
      @mouseleave="removeHoverStyle"
    >
      <p class="lead mb-4">My Portfolio Value</p>
      <h2>${{ portfolioValue | setCommas }}</h2>
      <button class="btn btn-success btn-md rounded-pill">View More</button>
    </div>

    <div
      class="homePane border rounded my-4"
      @mouseenter="addHoverStyle"
      @mouseleave="removeHoverStyle"
    >
      <p class="lead">Best Performing Asset</p>
      <span>{{ bestPerformingAsset.assetDetails.ticker }}</span>
      <h2 class="mb-4">{{ bestPerformingAsset.assetDetails.priceChange.toFixed(2) }}%</h2>
      <button class="btn btn-success btn-md rounded-pill">View More</button>
    </div>

    <div
      class="homePane border rounded my-4"
      @mouseenter="addHoverStyle"
      @mouseleave="removeHoverStyle"
    >
      <p class="lead">Worst Performing Asset</p>
      <span>{{ worstPerformingAsset.assetDetails.ticker }}</span>
      <h2 class="mb-4">{{ worstPerformingAsset.assetDetails.priceChange.toFixed(2) }}%</h2>
      <button class="btn btn-success btn-md rounded-pill">View More</button>
    </div>

    <div
      class="homePane border rounded my-4"
      @mouseenter="addHoverStyle"
      @mouseleave="removeHoverStyle"
    >
      <p class="lead">Your Profit</p>
      <h2>${{ netGrowth | setCommas }}</h2>
      <button class="btn btn-success btn-md rounded-pill">Fund Wallet</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      total: 125000,
    };
  },
  components: {},
  methods: {
    addHoverStyle(event) {
      event.target.classList.add("shadow");
    },
    removeHoverStyle(event) {
      event.target.classList.remove("shadow");
    },
  },
  computed: {
    ...mapGetters("stockMangementModule", ["portfolioValue", "bestPerformingAsset", "worstPerformingAsset", "netGrowth"]),
  },
};
</script>
<style scoped>
.homePane {
  padding: 35px 55px;
  flex-basis: 45%;
  text-align: center;
  transition: transform 0.5s;
}
.homePane h2 {
  font-size: 45px;
}
.homePane p {
  font-size: 15px;
}
.shadow {
  transform: scale(1.07);
}
</style>
