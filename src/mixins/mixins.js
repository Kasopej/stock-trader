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

const stockTransactionActionMixin = {
  methods: {
    updateQty(event, mode) {
      if (event.target.value < 0) {
        event.target.value = 0;
        return;
      }
      if (mode === "sell") {
        if (event.target.value > this.asset.quantity) {
          event.target.value = this.asset.quantity;
        }
        this.qtyToSell = +event.target.value;
      } else if (mode === "purchase") this.qtyToPurchase = +event.target.value;
    },
    buyStock(event) {
      if (event.response === true) {
        if (this.wallet >= this.sharePurchaseCost) {
          this.performTransaction(this.sharePurchaseCost * -1)
            .then(() =>
              this.updatePortfolioFromStock({
                stock: this.share,
                quantity: this.qtyToPurchase,
              })
            )
            .then(() => {
              this.qtyToPurchase = 0;
              this.closeModal("confirmBuyStock");
            });
        } else {
          this.qtyToPurchase = 0;
          alert(
            "You do not have enough money in your main wallet to fund this transaction. Please fund your wallet"
          );
          this.closeModal("confirmBuyStock");
        }
      } else this.closeModal("confirmBuyStock");
    },
    buyStockFromAsset(event) {
      if (event.response === true) {
        if (this.qtyToPurchase && this.wallet >= this.sharePurchaseCost) {
          this.performTransaction(this.sharePurchaseCost * -1)
            .then(() =>
              this.updatePortfolioFromAsset({
                asset: this.asset,
                quantity: this.qtyToPurchase,
              })
            )
            .then(() => {
              this.qtyToPurchase = 0;
              this.closeModal("confirmBuyStock");
            });
        } else {
          alert(
            "You do not have enough money in your main wallet to fund this transaction. Please fund your wallet"
          );
          this.closeModal("confirmBuyStock");
        }
      } else this.closeModal("confirmBuyStock");
    },
    sellStock(event) {
      if (event.response === true) {
        //check quantity case user forces button to be undisabled
        if (this.qtyToSell) {
          this.updatePortfolioFromAsset({
            asset: this.asset,
            quantity: this.qtyToSell * -1,
          })
            .then(() => this.performTransaction(this.assetSaleValue))
            .then(() => {
              this.qtyToSell = 0;
              this.closeModal("confirmSellStock");
            });
        }
      } else this.closeModal("confirmSellStock");
    },
  },
};

export { modalControlMixin, stockTransactionActionMixin };
