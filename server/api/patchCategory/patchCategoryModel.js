const mongoose = require("mongoose");

const PatchCategoryModel = mongoose.Schema(
  {
    patchCategoryId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    patchCategoryName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PatchCategory = mongoose.model("patchCategory", PatchCategoryModel);

module.exports = Customer;
