<template>
  <form @submit.prevent="attemptLogin(loginDetails)" class="w-50 m-auto mt-5">
    <div class="mb-3">
      <label for="exampleInputEmail" class="form-label">Email address</label>
      <input
        type="email"
        class="form-control"
        id="exampleInputEmail"
        aria-describedby="emailHelp"
        v-model="loginDetails.email"
      />
    </div>
    <div class="mb-4">
      <label for="exampleInputPassword" class="form-label">Password</label>
      <input type="password" class="form-control" id="exampleInputPassword"
      v-model="loginDetails.password" />
      <i class="inputIcon fa-solid fa-eye"></i>
    </div>
    <button
      type="submit"
      class="btn btn-primary rounded-pill d-block w-50 m-auto"
    >
      Submit
    </button>
    <p class="text-center text-muted mt-5 mb-0">
      Don't have an account?
      <router-link to="/register" class="fw-bold text-body"
        ><u>Register</u></router-link
      >
    </p>
  </form>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      loginDetails: {
        email: "", password: ""
      }
    }
  },
  methods: {
    ...mapActions(["attemptLogin"])
  },
  watch: {
    ["$store.state.authStoreModule.authenticated"](){
      this.$router.push("/home")
    }
  },
};
</script>

<style scoped>
form > div {
  position: relative;
}
.inputIcon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
