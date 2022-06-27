const router = require("express").Router();
const controller = require("./userController");
const isAuthenticatedUser = require("../../auth/auth").isAuthenticatedUser;

router.route("/").get(isAuthenticatedUser, controller.getAllUsers);
router
  .route("/customers")
  .get(isAuthenticatedUser, controller.getAllUserCustomers);

router
  .route("/:id")
  .get(isAuthenticatedUser, controller.getUserByID)
  .put(isAuthenticatedUser, controller.updateUserByID)
  .delete(isAuthenticatedUser, controller.deleteUserByID);

router
  .route("/customers/:id")
  .get(isAuthenticatedUser, controller.getUserByIDCustomers)
  .put(isAuthenticatedUser, controller.updateUserByIDCustomers)
  .delete(isAuthenticatedUser, controller.deleteUserByIDCustomers);

module.exports = router;
