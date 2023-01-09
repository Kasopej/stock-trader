<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-3">
    <button
      class="navbar-toggler btn"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div
      class="collapse navbar-collapse justify-content-lg-end"
      id="navbarSupportedContent"
    >
      <ul class="navbar-nav justify-content-end">
        <span
          v-if="authenticated"
          tag="li"
          class="nav-item"
          active-class="active"
          exact
          ><a class="nav-link" @onclick="doLogout">Logout</a></span
        >
        <router-link
          v-if="!authenticated"
          tag="li"
          class="nav-item"
          active-class="active"
          exact
          to="/register"
          ><a class="nav-link">Register</a></router-link
        >

        <router-link
          tag="li"
          class="nav-item"
          active-class="active"
          exact
          to="/profile"
          ><a class="nav-link" @click="logout">{{ name }}</a></router-link
        >

        <li class="nav-link fw-bold" style="vertical-align: middle">
          ${{ "1,000" }}
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  import { mapState, mapMutations } from "vuex";
  export default {
    data() {
      return {
        name: "Kasope",
      };
    },
    computed: {
      ...mapState("authStoreModule", ["authenticated"]),
    },
    methods: {
      ...mapMutations("authStoreModule", ["logout"]),
      doLogout() {
        this.logout();
        this.$router.push("/login");
      },
    },
  };
</script>

<style scoped>
  @media (min-width: 992px) {
    nav {
      padding-top: 0;
      padding-bottom: 2px;
    }
    .navbar-expand-lg {
      justify-content: space-around;
    }
    .navbar-collapse {
      position: relative;
      top: 2px;
    }
    li.active {
      background-color: rgb(219, 216, 216);
    }
  }
</style>
