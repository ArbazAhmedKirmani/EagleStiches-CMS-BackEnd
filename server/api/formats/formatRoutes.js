const express = require("express");
const router = express.Router();
const controller = require("./formatController");
const isAuthenticatedUser = require("../../auth/auth").isAuthenticatedUser;

router
  .route("/:id")
  .get(isAuthenticatedUser, controller.getFormatById)
  .put(isAuthenticatedUser, controller.updateFormatById)
  .delete(isAuthenticatedUser, controller.deleteFormatById);

router
  .route("/")
  .post(isAuthenticatedUser, controller.createFormat)
  .get(isAuthenticatedUser, controller.getAllFormats);

module.exports = router;
