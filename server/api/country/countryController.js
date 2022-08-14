const Country = require("./countryModel");
const Order = require("../orders/orderModel");

exports.createCountry = async (req, res) => {
  try {
    const { countryName } = req.body;
    const country = new Country({
      countryName,
    });
    await country.save();
    res.status(200).send({
      status: "Ok",
      message: "record created successfully",
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getAllCountry = async (req, res) => {
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
    let totalCount = await Country.countDocuments({ ...findQuery });
    const countrys = await Country.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      data: countrys,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getCountryById = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await Country.findById({ _id: id });
    res.status(200).send({ status: "Ok", data: country });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.updateCountryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { countryName } = req.body;
    await Country.findOneAndUpdate({ _id: id }, { countryName });

    let findQuery = {};
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    let totalCount = await Country.countDocuments({ ...findQuery });
    const countrys = await Country.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      message: "record updated successfully",
      data: countrys,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.deleteCountryById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ country: id });
    if (order) {
      res.status(400).send({ status: "Error", message: "record exist!" });
    } else {
      await Country.findByIdAndDelete({ _id: id });

      let findQuery = {};
      let top = 10;
      let skip = 0;
      let populate = "";
      let sort = "";

      let totalCount = await Country.countDocuments({ ...findQuery });
      const countrys = await Country.find({ ...findQuery })
        .populate(populate)
        .skip(skip)
        .limit(top)
        .sort(sort);

      res.status(200).send({
        status: "Ok",
        message: "record deleted successfully",
        data: countrys,
        count: totalCount,
      });
    }
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};
