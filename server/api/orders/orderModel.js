const mongoose = require("mongoose");

const OrderModel = mongoose.Schema(
  {
    orderNumber: {
      type: Number,
      default: 0,
    },
    designName: {
      type: String,
      required: true,
    },
    format: {
      type: mongoose.Schema.ObjectId,
      ref: "formats",
    },
    dimensionHeight: {
      type: Number,
      default: 0,
    },
    dimensionWeight: {
      type: Number,
      default: 0,
    },
    poNumber: {
      type: String,
    },
    unit: {
      type: mongoose.Schema.ObjectId,
      ref: "units",
    },
    numberOfColor: {
      type: Number,
      default: 1,
    },
    fabric: {
      type: String,
    },
    additionalInformation: {
      type: String,
    },
    isRushOrder: {
      type: Boolean,
      default: false,
    },
    isBlending: {
      type: Boolean,
      default: false,
    },
    uploadFileUrls: { type: String, required: true },
    link: {
      type: String,
    },
    orderType: {
      type: String,
      trim: true,
      enum: {
        values: ["Custom Patch", "Digitizing", "Vector Art"],
        default: "Digitizing",
      },
      required: true,
    },
    numberOfPieces: {
      type: Number,
      default: 1,
    },
    shape: {
      type: String,
      default: "",
    },
    patchCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "patchCategory",
    },
    placement: {
      type: mongoose.Schema.ObjectId,
      ref: "placements",
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
    orderMode: {
      type: String,
      trim: true,
      enum: {
        values: ["Form", "email"],
        default: "Form",
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

const Order = mongoose.model("order", OrderModel);

module.exports = Order;
