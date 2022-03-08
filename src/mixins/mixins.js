const modalControlMixin = {
  data() {
    return {
      shows: {
        //confirmBuyStock: false,
      },
    };
  },
  methods: {
    closeModal(modalName) {
      this.shows = Object.assign({}, this.shows, { [modalName]: false });
    },
    showModal(modalName) {
      this.shows = Object.assign({}, this.shows, { [modalName]: true });
    },
  },
};

export { modalControlMixin };
