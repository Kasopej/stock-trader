<template>
  <main>
    <div>
      <div
        class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style="
          min-height: 600px;
          background-size: cover;
          background-position: center top;
        "
      >
        <!-- Mask -->
        <span class="mask bg-gradient-default opacity-8"></span>
        <!-- Header container -->
        <div class="container-fluid d-flex align-items-center">
          <div class="row">
            <div class="col-lg-7 col-md-10">
              <h1 class="display-2 text-white">Hello {{ name }}</h1>
              <p class="text-white mt-0 mb-5">
                This is your profile page. You can see the progress you've made
                with your work and manage your projects or assigned tasks
              </p>
              <a
                href="#0"
                class="btn btn-info"
                @click.prevent="showModal('confirmSignout')"
                >Sign Out</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="shows.confirmSignout" class="myModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmation</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="closeModal('confirmSignout')"
            ></button>
          </div>
          <div class="modal-body">
            <p>Buy stock?</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal('confirmSignout')"
            >
              No
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="closeModal('confirmSignout')"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { modalControlMixin } from "../mixins/mixins";
import { mapGetters } from "vuex";
export default {
  mixins: [modalControlMixin],
  data() {
    return {};
  },
  methods: {},
  computed: {
    ...mapGetters(["name"]),
  },
};
</script>

<style scoped>
.header {
  background: 
    /* top, transparent red */ linear-gradient(
      rgba(139, 138, 199, 0.5),
      rgba(139, 138, 199, 0.5)
    ),
    /* your image */ url(../../public/assets/img/profile-background.jpg);
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
</style>
