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
    totalAmount: {
      type: Number,
    },
    paidAmount: {
      type: Number,
    },
    discountAmount: {
      type: Number,
    },
    netAmount: {
      type: Number,
    },
    balanceAmount: {
      type: Number,
    },
    status: {
      type: String,
      trim: true,
      enum: {
        values: ["Paid", "Partial Paid", "Unpaid"],
        default: "Unpaid",
      },
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("invoice", InvoiceModel);

module.exports = Invoice;
