const express = require("express");
const router = express.Router();
const controller = require("./patchCategoryController");
const isAuthenticatedUser = require("../../auth/auth").isAuthenticatedUser;

router
  .route("/:id")
  .get(isAuthenticatedUser, controller.getPatchCategoryById)
  .put(isAuthenticatedUser, controller.updatePatchCategoryById)
  .delete(isAuthenticatedUser, controller.deletePatchCategoryById);

router
  .route("/")
  .post(isAuthenticatedUser, controller.createPatchCategory)
  .get(isAuthenticatedUser, controller.getAllPatchCategory);

module.exports = router;
