var morgan = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");

// setup global middleware here

module.exports = function (app) {
  // Application Middlewares
  app.use(morgan("dev"));
  app.use(cors());
  app.use(bodyParser.json({ limit: "50mb" })); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true }));
};
