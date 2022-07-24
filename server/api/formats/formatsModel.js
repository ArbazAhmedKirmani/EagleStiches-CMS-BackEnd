const mongoose = require("mongoose");

const FormatModel = mongoose.Schema(
  {
    formatName: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

const Format = mongoose.model("formats", FormatModel);

module.exports = Format;
