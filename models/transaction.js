const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const transactionSchema = mongoose.Schema(
  {
    walletId: {
      type: ObjectId,
      ref: "wallet",
    },
    amount: Number,
    balance: Number,
    description: String,
    type: String,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

transactionSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Transaction", transactionSchema);
