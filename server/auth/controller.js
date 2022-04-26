const User = require("../api/users/userModel");
const signToken = require("./auth").signToken;

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
    const { username, email, password, phone, country, city, role } = req.body;

    const userData = {
      username,
      email,
      password,
      phone,
      country,
      city,
      role,
    };
    const newUser = new User(userData);
    newUser.save(async function (err, user) {
      if (err) {
        console.log("Error save block: ", err);
        return res
          .status(400)
          .send({ status: "Error", message: "Incorrect User Data" });
      }
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
