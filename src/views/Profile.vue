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
    <ConfirmationModal
      v-if="modals.confirmSignout.show"
      :text="modals.confirmSignout.text"
      :customEventName="modals.confirmSignout.customEventName"
      @[modals.confirmSignout.customEventName]="confirmLogout"
    ></ConfirmationModal>
  </main>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ConfirmationModal from "../components/reused-components/ConfirmationModal.vue";
export default {
  data() {
    return {
      modals: {
        confirmSignout: {
          text: `sign out?`,
          customEventName: "signout",
          show: false,
        },
      },
    };
  },
  methods: {
    ...mapActions(["logout"]),
    showModal(name) {
      this.modals[name].show = true;
    },
    closeModal(name) {
      this.modals[name].show = false;
    },
    confirmLogout(event) {
      if (event.response === true) {
        this.logout();
        this.closeModal("confirmSignout");
      } else this.closeModal("confirmSignout");
    },
  },
  computed: {
    ...mapGetters(["name"]),
  },
  components: { ConfirmationModal },
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
</style>
