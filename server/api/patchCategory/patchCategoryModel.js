const mongoose = require("mongoose");

const PatchCategoryModel = mongoose.Schema(
  {
    patchCategoryName: {
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

const PatchCategory = mongoose.model("patchCategory", PatchCategoryModel);

module.exports = PatchCategory;
