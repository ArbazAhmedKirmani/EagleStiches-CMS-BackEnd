const router = require("express").Router();
const controller = require("./userController");
const isAuthenticatedUser = require("../../auth/auth").isAuthenticatedUser;

router.route("/").get(isAuthenticatedUser, controller.getAllUsers);

router
  .route("/:id")
  .get(isAuthenticatedUser, controller.getUserByID)
  .put(isAuthenticatedUser, controller.updateUserByID)
  .delete(isAuthenticatedUser, controller.deleteUserByID);

module.exports = router;
