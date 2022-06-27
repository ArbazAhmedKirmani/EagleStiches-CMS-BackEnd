const User = require("./userModel");

// USER'S ROUTES

exports.getAllUsers = async (req, res) => {
  try {
    let findQuery = { isDeleted: false, role: { $ne: "Customer" } };
    const users = await User.find({ ...findQuery });
    res.status(200).send({ status: "Ok", data: users });
  } catch (err) {
    res
      .status(400)
      .send({ status: "Error", message: "Check Server Logs", error: err });
    console.log("Error :", err);
  }
};

exports.updateUserByID = async (req, res) => {
  try {
    const user_id = req.params.id;
    const modifiedBy = req.user._id;
    const userData = {
      fullName,
      phone,
      country,
      city,
      status,
      modifiedBy,
      salesPerson,
    };
    await User.findOneAndUpdate(user_id, userData);

    let findQuery = { isDeleted: false, role: { $ne: "Customer" } };
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    let totalCount = await User.countDocuments({ ...findQuery });
    const users = await User.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      message: "record updated successfully!",
      data: users,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "Check Server Logs" });
  }
};

exports.getUserByID = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await User.findById(user_id);
    const newObj = user.toObject();
    delete newObj.password;
    res.status(200).send({ status: "Ok", data: newObj });
  } catch (err) {
    console.log("Error :", err);
    res.status(500).send({ status: "Error", message: "Check Server Logs" });
  }
};

exports.deleteUserByID = async (req, res) => {
  try {
    const user_id = req.params.id;
    const date = new Date();
    const deletedBy = req.user._id;

    await User.findOneAndUpdate(
      { _id: user_id },
      { isDeleted: true, deletedAt: date, deletedBy }
    );

    let findQuery = { isDeleted: false, role: { $nin: ["Customer"] } };
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    let totalCount = await User.countDocuments({ ...findQuery });
    const users = await User.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      message: "record deleted successfully!",
      data: users,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(500).send({ status: "Error", message: "Check Server Logs" });
  }
};

// CUSTOMER ROUTES

exports.getAllUserCustomers = async (req, res) => {
  try {
    let findQuery = { isDeleted: false, role: "Customer" };
    const users = await User.find({ ...findQuery });
    res.status(200).send({ status: "Ok", data: users });
  } catch (err) {
    res.status(400).send({ status: "Error", message: "Check Server Logs" });
    console.log("Error :", err);
  }
};

exports.updateUserByIDCustomers = async (req, res) => {
  try {
    const user_id = req.params.id;
    const modifiedBy = req.user._id;
    const userData = {
      fullName,
      phone,
      country,
      city,
      status,
      modifiedBy,
      salesPerson,
    };
    await User.findOneAndUpdate(user_id, userData);

    let findQuery = { isDeleted: false, role: "Customer" };
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    let totalCount = await User.countDocuments({ ...findQuery });
    const users = await User.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      message: "record updated successfully!",
      data: users,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "Check Server Logs" });
  }
};

exports.getUserByIDCustomers = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await User.findById(user_id);
    const newObj = user.toObject();
    delete newObj.password;
    res.status(200).send({ status: "Ok", data: newObj });
  } catch (err) {
    console.log("Error :", err);
    res.status(500).send({ status: "Error", message: "Check Server Logs" });
  }
};

exports.deleteUserByIDCustomers = async (req, res) => {
  try {
    const user_id = req.params.id;
    const date = new Date();
    const deletedBy = req.user._id;

    await User.findOneAndUpdate(
      { _id: user_id },
      { isDeleted: true, deletedAt: date, deletedBy }
    );

    let findQuery = { isDeleted: false, role: "Customer" };
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    let totalCount = await User.countDocuments({ ...findQuery });
    const users = await User.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      message: "record deleted successfully!",
      data: users,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(500).send({ status: "Error", message: "Check Server Logs" });
  }
};
