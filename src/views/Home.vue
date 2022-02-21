<template>
  <div class="home d-flex flex-wrap justify-content-lg-between justify-content-around px-5 py-3">
    <div class="homePane border rounded my-4">
      <p class="lead mb-4">My Portfolio Growth</p>
      <h2>${{125000}}</h2>
      <button class="btn btn-success btn-md rounded-pill">View More</button>
    </div>

    <div class="homePane border rounded my-4">
      <p class="lead">Best Performing Asset</p>
      <h2 class="mb-4">${{125000}}</h2>
      <button class="btn btn-success btn-md rounded-pill">View More</button>
    </div>

    <div class="homePane border rounded my-4">
      <p class="lead">Worst Performing Asset</p>
      <h2 class="mb-4">${{125000}}</h2>
      <button class="btn btn-success btn-md rounded-pill">View More</button>
    </div>

    <div class="homePane border rounded my-4">
      <p class="lead">Your Balance</p>
      <h2>${{125000}}</h2>
      <button class="btn btn-success btn-md rounded-pill">Fund Wallet</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
};
</script>
<style scoped>
  .homePane{padding: 35px 55px; flex-basis: 32%; text-align: center;}
  .homePane:hover{}
  .homePane h2{font-size: 45px;}
  .homePane p {font-size: 15px;}
</style>
