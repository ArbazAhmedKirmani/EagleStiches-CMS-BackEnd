const mongoose = require("mongoose");

const PlacementModel = mongoose.Schema(
  {
    placementName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Placement = mongoose.model("placements", PlacementModel);

module.exports = Placement;
