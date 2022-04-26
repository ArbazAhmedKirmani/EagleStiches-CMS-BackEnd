const Customer = require("./customerModel");
const axios = require("axios");

exports.createCustomer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      createdBy,
      modifiedBy,
      status,
      isDeleted,
      deletedAt,
      deletedBy,
    } = req.body;
    const customer = new Customer({
      firstName,
      lastName,
      email,
      phoneNumber,
      createdBy,
      modifiedBy,
      status,
      isDeleted,
      deletedAt,
      deletedBy,
    });
    await customer.save();
    res.status(200).send({
      status: "Ok",
      message: "record created successfully",
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    let findQuery = { isDeleted: false };
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    if (req.query.name) {
      let regex = new RegExp(req.query.name);
      findQuery.name = { $regex: regex };
    }
    if (req.query.populate) {
      populate = req.query.populate;
    }

    if (req.query.top) {
      top = parseInt(req.query.top);
    }
    if (req.query.skip) {
      skip = parseInt(req.query.skip);
    }

    if (req.query.sort) {
      sort = req.query.sort;
    }
    let totalCount = await Customer.countDocuments({ ...findQuery });
    const customer = await Customer.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      data: customer,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById({ _id: id });
    res.status(200).send({ status: "Ok", data: customer });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.updateCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id;
    await Customer.findOneAndUpdate(
      { _id: id },
      { status, modifiedBy: userId }
    );
    res
      .status(200)
      .send({ status: "Ok", message: "record updated successfully" });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.deleteCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const date = new Date();
    const userId = req.user._id;
    await Customer.findOneAndUpdate(
      { _id: id },
      { isDeleted: true, deletedAt: date, deletedBy: userId }
    );
    res
      .status(200)
      .send({ status: "Ok", message: "record updated successfully" });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};
