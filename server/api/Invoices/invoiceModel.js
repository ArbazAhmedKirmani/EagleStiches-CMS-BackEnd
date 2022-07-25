const mongoose = require("mongoose");

const InvoiceModel = mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
    },
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    orders: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "order",
      },
    ],
    dateFrom: {
      type: Date,
      required: true,
    },
    dateTo: {
      type: Date,
      required: true,
    },
    invoiceUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("invoice", InvoiceModel);

module.exports = Invoice;
