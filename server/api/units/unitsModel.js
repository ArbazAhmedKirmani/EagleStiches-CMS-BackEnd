const mongoose = require("mongoose");

const UnitModel = mongoose.Schema(
  {
    unitName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Unit = mongoose.model("units", UnitModel);

module.exports = Unit;
