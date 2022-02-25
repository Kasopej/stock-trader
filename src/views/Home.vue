<template>
  <!-- <div v-if="!userAuthenticated">
            <section class="p-5 bg-primary text-white mb-0" id="about">
                <div class="container">
                    <h2 class="page-section-heading text-center text-uppercase text-white">About</h2>
                    <div class="row">
                        <div class="col-12 ms-auto text-center"><p class="lead mb-1">Welcome to your personal stock trading app</p>
                        <p class="lead">Use this application to buy shares, manage your portfolio, and grow your wealth!</p></div>
                    </div>
                </div>
            </section>

            
            <section class="p-5" id="contact">
                <div class="container">
                    <h2 class="text-center text-uppercase text-secondary mb-2">Login</h2>
                    <div class="row justify-content-center">
                        <div class="col-lg-8 col-xl-7">
                            <form id="contactForm">
                                <div class="form-floating mb-3">
                                    <input class="form-control" id="email" type="email" placeholder="Enter your email..." />
                                    <label for="email">email</label>
                                    <div class="invalid-feedback">A name is required.</div>
                                </div>
                                <div class="form-floating mb-3">
                                    <input class="form-control" id="password" type="password"/>
                                    <label for="password">Password</label>
                                    <div class="invalid-feedback">A password is required.</div>
                                </div>
                                <button class="btn btn-primary btn-xl disabled" id="submitButton" type="submit">Send</button>
                            </form>
                            <div class="mt-3">
                                <p>Don't have an account?</p><router-link to="/register">Register</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
  </div> -->
  <div
    class="home d-flex flex-wrap justify-content-lg-between justify-content-around px-5 py-3"
  >
    <div
      class="homePane border rounded my-4"
      @mouseenter="addHoverStyle"
      @mouseleave="removeHoverStyle"
    >
      <p class="lead mb-4">My Portfolio Growth</p>
      <h2>${{ 125000 }}</h2>
      <button class="btn btn-success btn-md rounded-pill">View More</button>
    </div>

    <div
      class="homePane border rounded my-4"
      @mouseenter="addHoverStyle"
      @mouseleave="removeHoverStyle"
    >
      <p class="lead">Best Performing Asset</p>
      <h2 class="mb-4">${{ 125000 }}</h2>
      <button class="btn btn-success btn-md rounded-pill">View More</button>
    </div>

    <div
      class="homePane border rounded my-4"
      @mouseenter="addHoverStyle"
      @mouseleave="removeHoverStyle"
    >
      <p class="lead">Worst Performing Asset</p>
      <h2 class="mb-4">${{ 125000 }}</h2>
      <button class="btn btn-success btn-md rounded-pill">View More</button>
    </div>

    <div
      class="homePane border rounded my-4"
      @mouseenter="addHoverStyle"
      @mouseleave="removeHoverStyle"
    >
      <p class="lead">Your Balance</p>
      <h2>${{ 125000 }}</h2>
      <button class="btn btn-success btn-md rounded-pill">Fund Wallet</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data() {
    return {
      userAuthenticated: false
    };
  },
  components: {},
  methods: {
    addHoverStyle(event) {
      event.target.classList.add("shadow");
    },
    removeHoverStyle() {
      event.target.classList.remove("shadow");
    },
  },
};
</script>
<style scoped>
.homePane {
  padding: 35px 55px;
  flex-basis: 32%;
  text-align: center;
  transition: transform 0.5s;
}
.homePane:hover {
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
