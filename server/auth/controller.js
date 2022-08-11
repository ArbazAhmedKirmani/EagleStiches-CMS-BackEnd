const User = require("../api/users/userModel");
const signToken = require("./auth").signToken;
const nodemailer = require("nodemailer");
const mailerConfig = require("../utils/serviceVariables");

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
        html: `<div>
        <div style="padding: 15px 30px; width: 100%; background-color: #cc1616; color: #fff;">
          <h1>Verify Your Email</h2>
        </div>
        <br/>
        <br/>
        <br/>
          <b>&nbsp; You are very near to create your account on Eagle Stiches</b>
          <br/>
          <br/>
          &nbsp; <a href="${process.env.PROD_FRONT_URL}/passwordverification/${user._id}" target="_blank">
            <input type="button" style="cursor:pointer;box-shadow: 0 0px 5px 0 rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.19);border-radius: 4px;font-size: 22px;font-weight: bold;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px; background-color: #cc1616;" value="Verify Email" />
          </a>
          </form>
        <br/>
        <br/>
        <br/>
        <h5>After manual verification your account will be activated and you will be notified on this Email</h5>
        <div style="padding: 3px 30px; width: 100%; background-color: #cc1616; color: #fff;">
          <p>Best Regards from Eagle Stiches</p>
        </div>
        <div>`, // html body
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
