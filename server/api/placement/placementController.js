const Placement = require("./placementModel");
const Order = require("../orders/orderModel");

exports.createPlacement = async (req, res) => {
  try {
    const { placementName } = req.body;
    const placement = new Placement({
      placementName,
    });
    await placement.save();
    res.status(200).send({
      status: "Ok",
      message: "record created successfully",
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getAllPlacements = async (req, res) => {
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
    let totalCount = await Placement.countDocuments({ ...findQuery });
    const placement = await Placement.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      data: placement,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getPlacementById = async (req, res) => {
  try {
    const { id } = req.params;
    const placement = await Placement.findById({ _id: id });
    res.status(200).send({ status: "Ok", data: placement });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.updatePlacementById = async (req, res) => {
  try {
    const { id } = req.params;
    const { placementName } = req.body;
    await Placement.findOneAndUpdate({ _id: id }, { placementName });
    res
      .status(200)
      .send({ status: "Ok", message: "record updated successfully" });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.deletePlacementById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = Order.findById({ placement: id });
    if (order) {
      res.status(400).send({ status: "Error", message: "record exist!" });
    } else {
      await Placement.findByIdAndDelete({ _id: id });
      res
        .status(200)
        .send({ status: "Ok", message: "record updated successfully" });
    }
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};
