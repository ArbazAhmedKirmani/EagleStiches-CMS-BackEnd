const Format = require("./formatsModel");
const Order = require("../orders/orderModel");

exports.createFormat = async (req, res) => {
  try {
    const { formatName, orderType } = req.body;
    const format = new Format({
      formatName,
      orderType,
    });
    await format.save();
    res.status(200).send({
      status: "Ok",
      message: "record created successfully",
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getAllFormats = async (req, res) => {
  try {
    let findQuery = {};
    let { top, skip, populate } = req.query;
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
    let totalCount = await Format.countDocuments({ ...findQuery });
    const format = await Format.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      data: format,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getFormatById = async (req, res) => {
  try {
    const { id } = req.params;
    const format = await Format.findById({ _id: id });
    res.status(200).send({ status: "Ok", data: format });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.updateFormatById = async (req, res) => {
  try {
    const { id } = req.params;
    const { formatName } = req.body;
    await Format.findOneAndUpdate({ _id: id }, { formatName });

    let findQuery = {};
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    let totalCount = await Format.countDocuments({ ...findQuery });
    const format = await Format.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      message: "record updated successfully",
      data: format,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.deleteFormatById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ format: id });
    if (order) {
      res.status(400).send({ status: "Error", message: "record exist!" });
    } else {
      await Format.findByIdAndDelete({ _id: id });
      let findQuery = {};
      let top = 10;
      let skip = 0;
      let populate = "";
      let sort = "";

      let totalCount = await Format.countDocuments({ ...findQuery });
      const format = await Format.find({ ...findQuery })
        .populate(populate)
        .skip(skip)
        .limit(top)
        .sort(sort);

      res.status(200).send({
        status: "Ok",
        message: "record deleted successfully",
        data: format,
        count: totalCount,
      });
    }
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};
