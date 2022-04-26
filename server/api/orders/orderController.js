const Order = require("./orderModel");
const axios = require("axios");

exports.createOrder = async (req, res) => {
  try {
    const {
      orderNumber,
      designFormat,
      orderMode,
      orderStatus,
      orderHistory,
      createdBy,
      modifiedBy,
      isDeleted,
      deletedAt,
      deletedBy,
    } = req.body;
    const order = new Order({
      orderNumber,
      designFormat,
      orderMode,
      orderStatus,
      orderHistory,
      createdBy,
      modifiedBy,
      status,
      isDeleted,
      deletedAt,
      deletedBy,
    });
    await order.save();
    res.status(200).send({
      status: "Ok",
      message: "record created successfully",
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getAllOrders = async (req, res) => {
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
    let totalCount = await Order.countDocuments({ ...findQuery });
    const order = await Order.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      data: order,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const Order = await Order.findById({ _id: id });
    res.status(200).send({ status: "Ok", data: Order });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { designFormat, orderMode, orderStatus } = req.body;
    const userId = req.user._id;
    await Order.findOneAndUpdate(
      { _id: id },
      { designFormat, orderMode, orderStatus, modifiedBy: userId }
    );
    res
      .status(200)
      .send({ status: "Ok", message: "record updated successfully" });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const date = new Date();
    const userId = req.user._id;
    await Order.findOneAndUpdate(
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