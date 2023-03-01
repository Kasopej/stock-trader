<template>
  <aside
    class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
    style="width: 280px"
  >
    <router-link
      to="/"
      class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
    >
      <svg class="bi me-2" width="40" height="32">
        <use xlink:href="#bootstrap"></use>
      </svg>
      <span class="fs-4">Smart FinSense</span>
    </router-link>
    <hr />
    <ul class="nav nav-pills flex-column mb-auto">
      <li tag="li" class="nav-item">
        <router-link class="nav-link" active-class="active" exact to="/home">
          <svg class="bi me-2" width="16" height="16">
            <use xlink:href="#home"></use>
          </svg>
          Home</router-link
        >
      </li>
      <li tag="li" class="nav-item">
        <router-link
          class="nav-link"
          active-class="active"
          exact
          to="/portfolio"
        >
          <svg class="bi me-2" width="16" height="16">
            <use xlink:href="#portfolio"></use>
          </svg>
          Portfolio</router-link
        >
      </li>
      <li tag="li" class="nav-item">
        <router-link class="nav-link" active-class="active" exact to="/stocks">
          <svg class="bi me-2" width="16" height="16">
            <use xlink:href="#stocks"></use>
          </svg>
          Stock Market</router-link
        >
      </li>
    </ul>
    <hr />
    <div class="dropdown">
      <a
        href="#"
        class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
        id="dropdownUser1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          src="https://github.com/mdo.png"
          alt=""
          width="32"
          height="32"
          class="rounded-circle me-2"
        />
        <strong>mdo</strong>
      </a>
      <ul
        class="dropdown-menu dropdown-menu-dark text-small shadow"
        aria-labelledby="dropdownUser1"
      >
        <li>
          <router-link class="dropdown-item" to="/profile">Profile</router-link>
        </li>
        <li><hr class="dropdown-divider" /></li>
        <li><a class="dropdown-item" href="#">Sign out</a></li>
      </ul>
    </div>
  </aside>
</template>

<script>
export default {};
</script>

<style scoped>
a {
  color: inherit;
}
a.active:hover {
  color: inherit;
  font-weight: normal;
}
a:hover {
  color: inherit;
  font-weight: bold;
}
</style>
