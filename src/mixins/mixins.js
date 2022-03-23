const numericalInputControlMixin = {
  //this mixin is called used in components that take input
  methods: {
    updateQty(event, mode) {
      if (event.target.value < 0) {
        event.target.value = 0;
        return;
      }
      if (this.inputModal) {
        if (this.limit) {
          event.target.value =
            event.target.value <= this.limit
              ? event.target.value
              : this.limit < 0
              ? 0
              : this.limit;
        } //if user enters value greater than zero except, set the input value back to the limit, except if the limit is less than zero, in which case set input value to zero
        this.modalInputValue = +event.target.value;
      } else if (mode === "sell") {
        if (event.target.value > this.asset.quantity) {
          //prevent user from selling more assets than are available
          event.target.value = this.asset.quantity;
        }
        this.qtyToSell = +event.target.value;
      } else if (mode === "purchase") this.qtyToPurchase = +event.target.value;
    },
  },
};

const stockTransactionActionMixin = {
  //this mixin is called used in components that perform stock tranasactions
  methods: {
    buyStock(event) {
      //true means the user confirmed the action.. check where this method is fired for better understanding
      if (event.response === true) {
        if (this.qtyToPurchase && this.wallet >= this.sharePurchaseCost) {
          this.performTransaction(this.sharePurchaseCost * -1)
            .then(() => {
              if (event.type === "assetStock") {
                this.updatePortfolioFromAsset({
                  asset: this.asset,
                  quantity: this.qtyToPurchase,
                });
              } else if (event.type === "marketStock") {
                this.updatePortfolioFromStock({
                  stock: this.share,
                  quantity: this.qtyToPurchase,
                });
              }
            })
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

export { numericalInputControlMixin, stockTransactionActionMixin };
