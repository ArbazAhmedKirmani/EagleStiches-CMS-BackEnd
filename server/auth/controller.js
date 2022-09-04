const User = require("../api/users/userModel");
const signToken = require("./auth").signToken;
const nodemailer = require("nodemailer");
const mailerConfig = require("../utils/serviceVariables");
const { verificationEmail } = require("../utils/Emails/verificationEmail");

exports.signin = async (req, res) => {
  const token = signToken(req.user._id, req.user.role);
  try {
    const user = await User.findOne({
      _id: req.user._id,
      isVerifiedUser: true,
    });
    if (user !== null) {
      console.log("inside");
      return res.status(200).send({ token: token, user: user });
    } else {
      return res
        .status(200)
        .send({ status: "Error", message: "Your account is not verified!" });
    }
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
    } = req.body;

    const userData = {
      fullName,
      email,
      password: "eaglestiches123",
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
      userData.features = ["paynow", "vieworder", "downloadzip", "editorder"];
    }
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
        to: user.email, // list of receivers
        subject: `Email Verification`, // Subject line
        html: verificationEmail(user._id),
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
      const url = `${PROD_FRONT_URL}/reset-password/?token=${resetToken}`;
      await transporter.sendMail({
        to: user.email,
        subject: "Reset Password",
        html: `<div
        style="
          font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
            sans-serif;
        "
      >
        <div style="padding: 12px; background: #dd1b1b; color: white;">
          <h1>Forget Password - Eagle Stiches</h1>
        </div>
        <div style="padding: 12px;">
          <h3>Hi we found that you make a request to reset your password.</h3>
          <h3>
            If this is the case. Please click the button to verify your request
          </h3>
          <br />
          <a
            style="
              background: #dd1b1b;
              color: white;
              padding: 12px;
              letter-spacing: 2px;
              border: none;
              text-decoration: none;
              box-shadow: 0 0 2px #dd1b1b;
            "
            href=${url};"
          >
            Verify Yourself
          </a>
          <br />
          <br />
          <h3>Otherwise, please ignore this email.</h3>
        </div>
      </div>"`,
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
