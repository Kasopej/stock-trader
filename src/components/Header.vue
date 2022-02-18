<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-3 py-2">
    <router-link class="navbar-brand" to="/">Home</router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse justify-content-lg-between" id="navbarSupportedContent">
      <ul class="navbar-nav">
        <router-link tag="li" class="nav-item" active-class="active" exact to="/portfolio"><a class="nav-link">Portfolio</a></router-link>
        <router-link tag="li" class="nav-item" active-class="active" exact to="/stocks"><a class="nav-link">Stocks</a></router-link>
      </ul>
      <ul class="navbar-nav justify-content-end">
        <router-link tag="li" class="nav-item" active-class="active" exact to="/login"><a class="nav-link">Login</a></router-link>
        <li class="nav-link fw-bold" style="vertical-align: middle;">${{funds}}</li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
    data() {
        return {
            funds: "25.00"
        }
    },
};
</script>

<style scoped>
@media (min-width: 992px){
    .navbar-expand-lg{justify-content: space-around;}
    .navbar-collapse{position: relative; top: 2px;}
}

</style>
