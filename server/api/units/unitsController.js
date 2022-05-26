const Unit = require("./unitsModel");
const Order = require("../orders/orderModel");

exports.createUnit = async (req, res) => {
  try {
    const { unitName } = req.body;
    const unit = new Unit({
      unitName,
    });
    await unit.save();
    res.status(200).send({
      status: "Ok",
      message: "record created successfully",
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getAllUnits = async (req, res) => {
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
    let totalCount = await Unit.countDocuments({ ...findQuery });
    const units = await Unit.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      data: units,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await Unit.findById({ _id: id });
    res.status(200).send({ status: "Ok", data: unit });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.updateUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    const { unitName } = req.body;
    await Unit.findOneAndUpdate({ _id: id }, { unitName });
    res
      .status(200)
      .send({ status: "Ok", message: "record updated successfully" });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.deleteUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ unit: id });
    if (order) {
      res.status(400).send({ status: "Error", message: "record exist!" });
    } else {
      await Unit.findByIdAndDelete({ _id: id });
      res
        .status(200)
        .send({ status: "Ok", message: "record deleted successfully" });
    }
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};
