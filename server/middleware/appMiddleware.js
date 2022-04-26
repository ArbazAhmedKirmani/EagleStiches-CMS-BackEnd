var morgan = require("morgan");
var express = require("express");
var cors = require("cors");

// setup global middleware here

module.exports = function (app) {
  // Application Middlewares
  app.use(morgan("dev"));
  app.use(cors());
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
};
