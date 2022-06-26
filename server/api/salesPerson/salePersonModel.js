const mongoose = require("mongoose");

const SalesPersonModel = mongoose.Schema(
  {
    salesPersonName: {
      type: String,
      required: true,
    },
    salesPersonEmail: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const salesPerson = mongoose.model("salesPersons", SalesPersonModel);

module.exports = salesPerson;
