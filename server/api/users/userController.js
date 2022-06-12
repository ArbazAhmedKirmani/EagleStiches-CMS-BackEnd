const User = require("./userModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({ status: "Ok", data: users });
  } catch (err) {
    res.status(400).send({ status: "Error", message: "Check Server Logs" });
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
    };
    await User.findOneAndUpdate(user_id, userData);

    let findQuery = { isDeleted: false };
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

    let findQuery = { isDeleted: false };
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
