const User = require("../api/users/userModel");
const jwt = require("jsonwebtoken");
const config = require("../config/development");
const AppError = require("../utils/api-error-handler");

const verifyPermissions = (url, method, role) => {
  try {
    if (role === "User") {
      const userPermissions = [
        {
          url: "/api/categories",
          method: "GET",
        },
        {
          url: "/api/companies",
          method: "GET",
        },
        {
          url: "/api/products",
          method: "GET",
        },
        {
          url: "/api/icons",
          method: "GET",
        },
      ];

      const accessIndex = (element) =>
        JSON.stringify(element) === JSON.stringify({ url, method });

      const access = userPermissions.findIndex(accessIndex);
      return access >= 0 && true;
    } else {
      return true;
    }
  } catch (err) {
    console.error("Error: ", err);
  }
};

exports.verifyUser = function (req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      throw new AppError("Please provide email and password to login");
    }
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          res
            .status(400)
            .send({ status: "Error", message: "wrong credentials" });
        }
        //  if(!user.confirmed){
        //      throw new AppError("Please confirm your email to login!",403)
        //    }

        user
          .authenticate(password)
          .then((pwd) => {
            confirmPassword = pwd;
            if (!confirmPassword) {
              res
                .status(400)
                .send({ status: "Error", message: "wrong credentials" });
            } else {
              // if everything is good,
              // then attach to req.user
              // and call next so the controller
              // can sign a token from the req.user._id
              let temp = user.toObject();
              delete temp.password;
              req.user = temp;
              next();
            }
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
};

exports.signToken = function (id, role) {
  try {
    return jwt.sign({ _id: id, role: role }, config.secrets.jwt, {
      expiresIn: config.expireTime,
    });
  } catch (err) {
    next(err);
  }
};

exports.isAuthenticatedUser = function (req, res, next) {
  try {
    if (req.headers.authorization) {
      var token = req.headers.authorization.split(" ")[1];
      var decoded = jwt.verify(token, config.secrets.jwt);
      User.findById({ _id: decoded._id })
        .then((usr) => {
          req.user = usr.toJson();
          const access = verifyPermissions(req.baseUrl, req.method, usr.role);
          if (access) {
            next();
          } else {
            res
              .status(401)
              .send({ status: "unauthorized", message: "unauthorized user" });
          }
        })
        .catch((err) => {
          next(err);
        });
    } else {
      res
        .status(401)
        .send({ status: "unauthorized", message: "unauthorized user" });
    }
  } catch (err) {
    res
      .status(401)
      .send({ status: "unauthorized", message: "unauthorized user" });
  }
};
