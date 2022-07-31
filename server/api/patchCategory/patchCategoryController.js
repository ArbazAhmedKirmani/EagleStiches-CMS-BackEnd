const PatchCategory = require("./patchCategoryModel");
const Order = require("../orders/orderModel");

exports.createPatchCategory = async (req, res) => {
  try {
    const { patchCategoryName, orderType } = req.body;
    const patchCategory = new PatchCategory({
      patchCategoryName,
      orderType,
    });
    await patchCategory.save();
    res.status(200).send({
      status: "Ok",
      message: "record created successfully",
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getAllPatchCategory = async (req, res) => {
  try {
    let findQuery = {};
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    if (req.query.patchCategoryName) {
      findQuery.patchCategoryName = req.query.patchCategoryName;
    }

    if (req.query.orderType) {
      findQuery.orderType = req.query.orderType;
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
    let totalCount = await PatchCategory.countDocuments({ ...findQuery });
    const patchCategories = await PatchCategory.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      data: patchCategories,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getPatchCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const patchCategory = await PatchCategory.findById({ _id: id });
    res.status(200).send({ status: "Ok", data: patchCategory });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.updatePatchCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { patchCategoryName } = req.body;
    await PatchCategory.findOneAndUpdate({ _id: id }, { patchCategoryName });

    let findQuery = {};
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    let totalCount = await PatchCategory.countDocuments({ ...findQuery });
    const patchCategories = await PatchCategory.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      message: "record updated successfully",
      data: patchCategories,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.deletePatchCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ patchCategory: id });
    if (order) {
      res.status(400).send({ status: "Error", message: "record exist!" });
    } else {
      await PatchCategory.findByIdAndDelete({ _id: id });

      let findQuery = {};
      let top = 10;
      let skip = 0;
      let populate = "";
      let sort = "";

      let totalCount = await PatchCategory.countDocuments({ ...findQuery });

      const patchCategories = await PatchCategory.find({ ...findQuery })
        .populate(populate)
        .skip(skip)
        .limit(top)
        .sort(sort);

      res.status(200).send({
        status: "Ok",
        message: "record deleted successfully",
        data: patchCategories,
        count: totalCount,
      });
    }
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};
