const express = require("express");
const router = express.Router();
const controller = require("./dashboardController");
const isAuthenticatedUser = require("../../auth/auth").isAuthenticatedUser;

router.route("/").get(isAuthenticatedUser, controller.getAllDashboardData);

module.exports = router;
