const mongoose = require("mongoose");

const CountryModel = mongoose.Schema(
  {
    countryName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Country = mongoose.model("country", CountryModel);

module.exports = Country;
