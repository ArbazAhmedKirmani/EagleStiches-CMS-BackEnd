const express = require("express");
const router = express.Router();
const controller = require("./customerController");
const isAuthenticatedUser = require("../../auth/auth").isAuthenticatedUser;

router
  .route("/:id")
  .get(isAuthenticatedUser, controller.getCustomerById)
  .put(isAuthenticatedUser, controller.updateCustomerById)
  .delete(isAuthenticatedUser, controller.deleteCustomerById);

router
  .route("/")
  .post(isAuthenticatedUser, controller.createCustomer)
  .get(isAuthenticatedUser, controller.getAllCustomers);

module.exports = router;
