const express = require("express");
const router = express.Router();
const controller = require("./unitsController");
const isAuthenticatedUser = require("../../auth/auth").isAuthenticatedUser;

router
  .route("/:id")
  .get(isAuthenticatedUser, controller.getUnitById)
  .put(isAuthenticatedUser, controller.updateUnitById)
  .delete(isAuthenticatedUser, controller.deleteUnitById);

router
  .route("/")
  .post(isAuthenticatedUser, controller.createUnit)
  .get(isAuthenticatedUser, controller.getAllUnits);

module.exports = router;
