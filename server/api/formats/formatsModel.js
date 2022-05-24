const mongoose = require("mongoose");

const FormatModel = mongoose.Schema(
  {
    formatId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    formatName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Format = mongoose.model("formats", FormatModel);

module.exports = Format;
