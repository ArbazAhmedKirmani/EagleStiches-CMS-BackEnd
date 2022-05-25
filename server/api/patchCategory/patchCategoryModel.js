const mongoose = require("mongoose");

const PatchCategoryModel = mongoose.Schema(
  {
    patchCategoryName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PatchCategory = mongoose.model("patchCategory", PatchCategoryModel);

module.exports = PatchCategory;
