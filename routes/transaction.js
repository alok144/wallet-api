const express = require("express");
const router = express.Router();

const Transaction = require("../models/transaction");
const Wallet = require("../models/wallet");

router.post("/:walletId", async (req, res) => {
  const walletId = req.params.walletId;
  const { amount, type, description } = req.body;

  const walletDetails = await Wallet.findOne({ _id: walletId });
  let balance = walletDetails?.balance;
  if (type == "CREDIT") {
    walletDetails.balance = balance + parseFloat(amount);
    await walletDetails.save();
  } else if (type == "DEBIT") {
    walletDetails.balance = balance - parseFloat(amount);
    if(walletDetails.balance < 0) {
        return res.status(400).send("Insufficient Balance!");
    }
    await walletDetails.save();
  }
  let transaction = new Transaction({
    amount: parseFloat(amount).toFixed(4),
    type,
    description,
    balance: walletDetails.balance?.toFixed(4),
    walletId,
  });

  transaction = await transaction.save();

  if (!transaction)
    return res.status(400).send("Transaction cannot be created");
res
    .status(200)
    .json({
      success: true,
      message: "Transaction executed successfully",
      data: transaction.toObject(),
    });

});

router.get("/:walletId", async (req, res) => {
  const limit = 10;
  const currentPage = req.query?.currentPage;
  const sortBy = req.query?.sortBy;
  const skip = (currentPage - 1) * limit;
  const walletId = req.params.walletId;
  let sortCriteria = { createdAt: -1 };
  if (sortBy == "oldestFirst") {
    sortCriteria = { createdAt: 1 };
  } else if (sortBy == "lowAmountFirst") {
    sortCriteria = { amount: 1 };
  } else if (sortBy == "highAmountFirst") {
    sortCriteria = { amount: -1 };
  }
  const transactionList = await Transaction.find({ walletId })
    .limit(limit)
    .skip(skip)
    .sort(sortCriteria);
  const totalCount = await Transaction.countDocuments({ walletId });

  if (!transactionList) {
    res.status(500).json({ success: false });
  }

  res
    .status(200)
    .json({
      success: true,
      message: "Transactions fetched successfully",
      data: { transactionList, totalCount },
    });
});

module.exports = router;
