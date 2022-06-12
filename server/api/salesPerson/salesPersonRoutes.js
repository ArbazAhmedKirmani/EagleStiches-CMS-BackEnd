const express = require("express");
const router = express.Router();
const controller = require("./salesPersonController");
const isAuthenticatedUser = require("../../auth/auth").isAuthenticatedUser;

router
  .route("/:id")
  .get(isAuthenticatedUser, controller.getPlacementById)
  .put(isAuthenticatedUser, controller.updatePlacementById)
  .delete(isAuthenticatedUser, controller.deletePlacementById);

router
  .route("/")
  .post(isAuthenticatedUser, controller.createPlacement)
  .get(isAuthenticatedUser, controller.getAllPlacements);

module.exports = router;
