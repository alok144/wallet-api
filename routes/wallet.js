const express = require("express");
const router = express.Router();

const Wallet = require("../models/wallet");

router.post("/setup", async (req, res) => {
  let wallet = new Wallet({
    name: req.body.name,
    balance: req.body.balance,
  });

  wallet = await wallet.save();

  if (!wallet) return res.status(404).send("Wallet cannot be created");
  res.send(wallet);
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
