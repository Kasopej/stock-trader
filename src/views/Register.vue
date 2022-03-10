<template>
  <div class="mask d-flex align-items-center p-5">
    <div class="container">
      <div class="row d-flex justify-content-center align-items-center">
        <div class="col-12 col-md-9 col-lg-7 col-xl-6">
          <h2 class="text-center mb-3">Create your account</h2>
          <form @submit.prevent="submitLoginForm">
            <div class="form-outline mb-2">
              <input
                type="text"
                id="registerName"
                class="form-control form-control-lg"
              />
              <label class="form-label" for="registerName">Your Name</label>
            </div>

            <div class="form-outline mb-2">
              <input
                type="email"
                id="registerEmail"
                class="form-control form-control-lg"
                v-model="user.email"
              />
              <label class="form-label" for="registerEmail">Your Email</label>
            </div>

            <div class="form-outline mb-2">
              <input
                type="password"
                id="registerPassword"
                class="form-control form-control-lg"
                ref="password"
              />
              <i class="passwordInputIcon fa-solid fa-eye" @click="togglePasswordVisibility"></i>
              <label class="form-label" for="registerPassword">Password</label>
            </div>

            <div class="form-outline mb-2">
              <input
                type="password"
                id="registerConfirmPassword"
                class="form-control form-control-lg"
                v-model="user.password"
                ref="repeatPassword"
              />
              <i class="passwordInputIcon fa-solid fa-eye" @click="toggleRepeatPasswordVisibility"></i>
              <label class="form-label" for="registerConfirmPassword"
                >Repeat your password</label
              >
            </div>

            <div class="form-check d-flex justify-content-center mb-3">
              <input
                class="form-check-input me-2"
                type="checkbox"
                value=""
                id="agreement"
                v-model="termsAreAgreed"
              />
              <label class="form-check-label" for="agreement">
                I agree to all statements in
                <a href="#!" class="text-body"><u>Terms of service</u></a>
              </label>
            </div>

            <div class="d-flex justify-content-center">
              <button
                type="submit"
                class="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
              >
                Register
              </button>
            </div>

            <p class="text-center text-muted mt-5 mb-0">
              Have already an account?
              <router-link to="/login" class="fw-bold text-body"
                ><u>Login here</u></router-link
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      user: { email: "", password: "" },
      termsAreAgreed: false,
      formValidated: true,
    };
  },
  methods: {
    ...mapActions({ registerUser: "attemptUserRegistration" }),
    togglePasswordVisibility(){
      this.$refs.password.type = (this.$refs.password.type === "password") ? "text" : "password";
    },
    toggleRepeatPasswordVisibility(){
      this.$refs.repeatPassword.type = (this.$refs.repeatPassword.type === "password") ? "text" : "password";
    },
    submitLoginForm() {
      if (this.formValidated)
        this.$store.dispatch("attemptUserRegistration", this.user);
    },
  },
  watch: {
    ["$store.state.authStoreModule.authenticated"]() {
      this.$router.push("/home");
    },
  },
};
</script>

<style>
  form > div {
  position: relative;
  }
  .passwordInputIcon {
  position: absolute;
  bottom: 45px;
  right: 10px;
  cursor: pointer;
  }
</style>
