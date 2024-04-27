const mongoose = require("mongoose");

const walletSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

walletSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

walletSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Wallet", walletSchema);
