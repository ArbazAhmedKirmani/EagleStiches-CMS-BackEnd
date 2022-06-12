const SalesPerson = require("./salePersonModel");
const Order = require("../orders/orderModel");

exports.createSalesPerson = async (req, res) => {
  try {
    const { salesPersonName, salesPersonEmail, description } = req.body;
    const salesPerson = new SalesPerson({
      salesPersonName,
      salesPersonEmail,
      description,
    });
    await salesPerson.save();
    res.status(200).send({
      status: "Ok",
      message: "record created successfully",
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getAllSalesPersons = async (req, res) => {
  try {
    let findQuery = {};
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
    let totalCount = await SalesPerson.countDocuments({ ...findQuery });
    const salesPerson = await SalesPerson.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      data: salesPerson,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getSalesPersonById = async (req, res) => {
  try {
    const { id } = req.params;
    const salesPerson = await SalesPerson.findById({ _id: id });
    res.status(200).send({ status: "Ok", data: salesPerson });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.updateSalesPersonById = async (req, res) => {
  try {
    const { id } = req.params;
    const { salesPersonName, salesPersonEmail } = req.body;

    await SalesPerson.findOneAndUpdate(
      { _id: id },
      { salesPersonName, salesPersonEmail }
    );

    let findQuery = {};
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    let totalCount = await SalesPerson.countDocuments({ ...findQuery });
    const salesPerson = await SalesPerson.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      message: "record updated successfully!",
      data: salesPerson,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.deleteSalesPersonById = async (req, res) => {
  try {
    const { id } = req.params;
    await SalesPerson.findByIdAndDelete({ _id: id });

    let findQuery = {};
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    let totalCount = await SalesPerson.countDocuments({ ...findQuery });
    const salesPerson = await SalesPerson.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      message: "record deleted successfully!",
      data: salesPerson,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};
