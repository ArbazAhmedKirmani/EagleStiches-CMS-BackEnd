var morgan = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var fileUpload = require("express-fileupload");

// setup global middleware here

module.exports = function (app) {
  // Application Middlewares
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: ["http://45.14.194.131:3000", "http://localhost:3000"],
      optionsSuccessStatus: 200, // For legacy browser support
    })
  );
  app.use(bodyParser.json({ limit: "50mb" })); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(fileUpload());
};
