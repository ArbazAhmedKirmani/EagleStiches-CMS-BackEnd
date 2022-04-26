const mongoose = require("mongoose");

const OrderModel = mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
    },
    designFormat: {
      type: String,
      trim: true,
      enum: {
        values: ["Custom Patch", "Vector Art", "Digitizing"],
        default: "Digitizing",
      },
      required: true,
    },
    orderMode: {
      type: String,
      trim: true,
      enum: {
        values: ["Form", "email"],
        default: "Form",
      },
      required: true,
    },
    orderStatus: {
      type: String,
      trim: true,
      enum: {
        values: [
          "pending",
          "accepted",
          "processing",
          "completed",
          "rejected",
          "deactivated",
        ],
        default: "pending",
      },
      required: true,
    },
    orderHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      required: true,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

OrderModel.plugin(AutoIncrement, {
  id: "order_seq",
  inc_field: "orderNumber",
});

const Order = mongoose.model("order", OrderModel);

module.exports = Order;
