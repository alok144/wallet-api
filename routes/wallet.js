const express = require("express");
const router = express.Router();

const Wallet = require("../models/wallet");
const Transaction = require("../models/transaction");

router.post("/setup", async (req, res) => {
  let { balance } = req.body;
  balance = parseFloat(balance).toFixed(4);
  let wallet = new Wallet({
    name: req.body.name,
    balance,
  });

  wallet = await wallet.save();

  let transaction = new Transaction({
    amount: balance,
    type: "CREDIT",
    balance,
    description: 'Create Wallet',
    walletId: wallet._id,
  });

  transaction = await transaction.save();

  if (!wallet) return res.status(404).send("Wallet cannot be created");
  
  res
    .status(200)
    .json({
      success: true,
      message: "Wallet created successfully",
      data: {...(wallet.toObject()), transactionId: transaction._id},
    });
});

router.delete("/delete/:id", (req, res) => {
  try {
    const wallet = Wallet.findOneAndUpdate(
      { _id: req.params.id },
      { deleted: true }
    );
    if (wallet) {
      return res
        .status(200)
        .json({ success: true, message: "Wallet deleted successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Wallet cannot find" });
    }
  } catch (err) {
    return res.status(400).json({ success: false, error: err });
  }
});

module.exports = router;
