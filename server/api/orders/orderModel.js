const mongoose = require("mongoose");

const OrderModel = mongoose.Schema(
  {
    orderNumber: {
      type: String,
      default: 0,
    },
    discount: {
      type: Number,
      default: null,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    freeOrder: {
      type: Boolean,
    },
    invoiced: {
      type: Boolean,
    },
    quotationId: {
      type: mongoose.Schema.ObjectId,
      ref: "quotation",
    },
    designName: {
      type: String,
      required: true,
    },
    format: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "formats",
      },
    ],
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
    colorSeperation: {
      type: Boolean,
      default: false,
    },
    uploadFileUrl: { type: String },
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
      type: String,
      default: 1,
    },
    shape: {
      type: String,
      default: "",
    },
    orderPdf: {
      type: String,
      default: "",
    },
    otherFormat: {
      type: String,
      default: "",
    },
    orderfileUrls: [
      {
        type: String,
        default: "",
      },
    ],
    price: {
      type: Number,
      default: 0,
    },
    pieces: {
      type: mongoose.Schema.ObjectId,
      ref: "pieces",
    },
    patchCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "patchCategory",
      },
    ],
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
          "delivered",
          "paid",
          "rejected",
          "deactivated",
        ],
        default: "pending",
      },
      required: true,
    },
    salesPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "salesPersons",
      default: null,
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
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isInvoiced: {
      type: Boolean,
      default: false,
    },
    deliveredFiles: [
      {
        type: String,
        default: "",
      },
    ],
    deliveredFilesUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", OrderModel);

module.exports = Order;
