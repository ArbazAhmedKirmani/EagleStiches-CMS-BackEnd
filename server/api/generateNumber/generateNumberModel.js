const mongoose = require("mongoose");

const NumberModel = mongoose.Schema(
  {
    invoiceNumber: {
      type: Number,
    },
    orderNumber: {
      type: Number,
    },
    quotationNumber: {
      type: Number,
    },
    paymentNumber: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Number = mongoose.model("number", NumberModel);

module.exports = Number;
