<template>
  <form @submit.prevent="submitLogin" class="w-50 m-auto mt-5">
    <div class="mb-3">
      <label for="exampleInputEmail1" class="form-label">Email address</label>
      <input
        type="email"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        v-model="email"
      />
    </div>
    <div class="mb-4">
      <label for="exampleInputPassword1" class="form-label">Password</label>
      <input
        type="password"
        v-model="password"
        class="form-control"
        id="exampleInputPassword1"
      />
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
import { mapActions } from "vuex";
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    ...mapActions("authStoreModule", { login: "attemptLogin" }),
    submitLogin() {
      if (!(this.email && this.password)) return;
      this.login({ email: this.email, password: this.password }).then(() => {
        this.$router.push("/");
      });
    },
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
