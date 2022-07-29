const User = require("../api/users/userModel");
const signToken = require("./auth").signToken;
const nodemailer = require("nodemailer");

exports.signin = async (req, res) => {
  const token = signToken(req.user._id, req.user.role);
  try {
    const user = await User.findOne({ _id: req.user._id });
    return res.status(200).send({ token: token, user: user.toJson() });
  } catch (err) {
    return res
      .status(500)
      .send({ status: "Error", message: "Check Server Logs" });
  }
};

exports.signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      country,
      city,
      role,
      comapnyName,
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
    } = req.body;

    const userData = {
      fullName,
      email,
      password,
      phone,
      country,
      city,
      role,
      isDeleted: false,
      status: true,
      comapnyName,
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
    };
    const newUser = new User(userData);
    newUser.save(async function (err, user) {
      if (err) {
        console.log("Error save block: ", err);
        return res
          .status(400)
          .send({ status: "Error", message: "Incorrect User Data" });
      }
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: mailerConfig.email, // generated ethereal user
          pass: mailerConfig.password, // generated ethereal password
        },
      });
      await transporter.sendMail({
        from: "Eagle Stiches", // sender address
        to: foundQuotation.createdBy.email, // list of receivers
        subject: `Email Verification`, // Subject line
        html: `http://localhost:3002/verify/${user._id}`, // html body
      });
      res.status(201).send({
        status: "success",
        message: "User Created Successfully. Please Login",
      });
    });
  } catch (err) {
    console.log("Error: ", err);
    res.send({ status: "Error", message: "Check Server Logs" });
  }
};

exports.resetPassword = (req, res) => {
  const email = req.body.email;
  User.findOne({ email: email }).then(async (user) => {
    if (!user) {
      res.status(500).send({ error: "No user Found" });
    }
    if (user.passwordResetToken) {
      user.passwordResetToken = undefined;
      user.save();
    }

    try {
      // Send confirmation Email
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "noreply@digikampus.com",
          pass: "Pr0f3ssi0n2l",
        },
      });
      const resetToken = jwt.sign(
        {
          _id: user._id,
        },
        "PasswordResetToken",
        {
          expiresIn: "20m",
        }
      );
      user.passwordResetToken = resetToken;
      user.save((err, user) => {
        if (err) {
          res.json({ error: "Cannot saved the data " });
        }
      });
      //  Client Side url
      const url = `http://localhost:3001/reset-password/?token=${resetToken}`;
      await transporter.sendMail({
        to: user.email,
        subject: "Reset Password",
        html: `Please click on the link to reset your password: <a href="${url}">>${url}</a>`,
      });

      res.status(200).send({ error: "Success" });
    } catch (err) {
      console.log("Nodemailer error", e.message);
    }
  });
};

exports.verifyEmail = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          isVerifiedEmail: true,
        },
      }
    );

    res.status(200).send({
      status: "Ok",
      message: "User Verified",
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};
