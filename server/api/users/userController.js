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
    const userData = {
      username,
      phone,
      location,
    };
    const user = await User.findByIdAndUpdate(user_id, userData);
    const newObj = user.toObject();
    delete newObj.password;
    delete newObj.clinics;
    res.status(200).send({ status: "Ok", data: newObj });
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
    delete newObj.clinics;
    res.status(200).send({ status: "Ok", data: newObj });
  } catch (err) {
    console.log("Error :", err);
    res.status(500).send({ status: "Error", message: "Check Server Logs" });
  }
};

exports.deleteUserByID = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await User.findByIdAndDelete(user_id);
    res.status(200).send({ status: "Ok", data: user });
  } catch (err) {
    console.log("Error :", err);
    res.status(500).send({ status: "Error", message: "Check Server Logs" });
  }
};
