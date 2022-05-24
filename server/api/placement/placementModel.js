const mongoose = require("mongoose");

const PlacementModel = mongoose.Schema(
  {
    placementId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    placementName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Placement = mongoose.model("placements", PlacementModel);

module.exports = Customer;
