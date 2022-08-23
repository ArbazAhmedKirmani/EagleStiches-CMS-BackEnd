const User = require("./userModel");

// USER'S ROUTES

exports.getAllUsers = async (req, res) => {
  try {
    let findQuery = { isDeleted: false };
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    if (req.query.role) {
      findQuery["role"] = req.query.role;
    }

    if (req.query.isVerifiedEmail) {
      findQuery.isVerifiedEmail = req.query.isVerifiedEmail;
    }

    if (req.query.confirmed) {
      findQuery.confirmed = req.query.confirmed;
    }

    if (req.query.isDeleted) {
      findQuery.isDeleted = req.query.isDeleted;
    }

    if (req.query.name) {
      let regex = new RegExp(req.query.name);
      findQuery.name = { $regex: regex };
    }
    if (req.query.userId) {
      findQuery.createdBy = req.query.userId;
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

    let totalCount = await User.countDocuments({ ...findQuery });
    let users;
    if (req.query.role === "user")
      users = await User.find({ ...findQuery, role: { $ne: "Customer" } })
        .populate(populate)
        .skip(skip)
        .limit(top)
        .sort(sort)
        .select("-password");
    else
      users = await User.find({ ...findQuery })
        .populate(populate)
        .skip(skip)
        .limit(top)
        .sort(sort)
        .select("-password");

    res.status(200).send({
      status: "Ok",
      data: users,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      country,
      city,
      role,
      companyName,
      menus,
      features,
      state,
      zipCode,
      postalAddress,
      deliveryAddress,
      phoneNumber,
      cellNumber,
      fax,
      website,
      employeeEmails,
      references,
      NTN,
      advanceAmount,
      isVerifiedEmail,
      isVerifiedUser,
      chestCapPrice,
      jacketBackPriceStart,
      customerAdditionalInfo,
      vectorPrice,
    } = req.body;

    const userData = {
      fullName,
      email,
      password: "eaglestiches123",
      phone,
      country,
      city,
      role,
      isDeleted: false,
      status: true,
      companyName,
      menus,
      features,
      state,
      zipCode,
      postalAddress,
      deliveryAddress,
      phoneNumber,
      cellNumber,
      fax,
      website,
      employeeEmails,
      references,
      NTN,
      advanceAmount,
      isVerifiedEmail,
      isVerifiedUser,
      chestCapPrice,
      jacketBackPriceStart,
      customerAdditionalInfo,
      vectorPrice,
    };

    if (userData.role === "Customer") {
      userData.menus = [
        "dashboard",
        "order",
        "profile",
        "payment",
        "invoice",
        "quotation",
      ];
      userData.features = [
        "paynow",
        "vieworder",
        "downloadzip",
        "editorder",
        "payinvoice",
        "viewinvoice",
      ];
    }

    await User.create(userData);

    let findQuery = { isDeleted: false };
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    if (req.query.role) {
      findQuery.role = req.query.role;
    }

    let totalCount = await User.countDocuments({ ...findQuery });
    const users = await User.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort)
      .select("-password");

    res.status(200).send({
      status: "Ok",
      message: "record created successfully!",
      data: users,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "Check Server Logs" });
  }
};

exports.updateUserByID = async (req, res) => {
  try {
    const user_id = req.params.id;
    const {
      fullName,
      phone,
      country,
      city,
      menus,
      features,
      state,
      zipCode,
      postalAddress,
      deliveryAddress,
      phoneNumber,
      cellNumber,
      fax,
      website,
      employeeEmails,
      references,
      NTN,
      advanceAmount,
      isVerifiedUser,
      status,
      companyName,
      salesPerson,
      chestCapPrice,
      jacketBackPriceStart,
      customerAdditionalInfo,
      vectorPrice,
    } = req.body;

    const userData = {
      fullName,
      phone,
      country,
      city,
      menus,
      features,
      state,
      zipCode,
      postalAddress,
      deliveryAddress,
      phoneNumber,
      cellNumber,
      fax,
      website,
      employeeEmails,
      references,
      NTN,
      advanceAmount,
      isVerifiedUser,
      status,
      companyName,
      salesPerson,
      chestCapPrice,
      jacketBackPriceStart,
      customerAdditionalInfo,
      vectorPrice,
    };
    await User.findOneAndUpdate({ _id: user_id }, userData);

    let findQuery = { isDeleted: false };
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    if (req.query.role) {
      findQuery.role = req.query.role;
    }

    let totalCount = await User.countDocuments({ ...findQuery });
    const users = await User.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort)
      .select("-password");

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

exports.updateUserStatus = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { isVerifiedUser } = req.body;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: mailerConfig.email, // generated ethereal user
        pass: mailerConfig.password, // generated ethereal password
      },
    });

    const userData = {
      isVerifiedUser,
    };
    await User.findOneAndUpdate({ _id: user_id }, userData);

    res.status(200).send({
      status: "Ok",
      message: "User Verified successfully!",
    });

    await transporter.sendMail({
      from: "Eagle Stiches", // sender address
      to: req.user.email, // list of receivers
      subject: `User Verification`, // Subject line
      html: ` <b> Your user account verified successfully </b> <br> <b>Email</b> # ${req.user.email} <br> <b>Password</b> # eaglestiches123`, // html body
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

    if (req.query.role) {
      findQuery.role = req.query.role;
    }

    let totalCount = await User.countDocuments({ ...findQuery });
    const users = await User.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort)
      .select("-password");

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
    let populate;
    let findQuery = { isDeleted: false };
    if (req.query.populate) {
      populate = req.query.populate;
    }
    const users = await User.find({ ...findQuery });
    // .populate(populate);
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
      fullName: req.body.fullName,
      phone: req.body.phone,
      country: req.body.country,
      city: req.body.city,
      status: req.body.status,
      modifiedBy: req.body.modifiedBy,
      salesPerson: req.body.salesPerson,
    };
    console.log(userData);
    await User.findOneAndUpdate(user_id, userData, { isDeleted: false });

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
