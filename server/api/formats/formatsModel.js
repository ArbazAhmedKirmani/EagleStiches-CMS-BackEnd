const mongoose = require("mongoose");

const FormatModel = mongoose.Schema(
  {
    formatName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Format = mongoose.model("formats", FormatModel);

module.exports = Format;
