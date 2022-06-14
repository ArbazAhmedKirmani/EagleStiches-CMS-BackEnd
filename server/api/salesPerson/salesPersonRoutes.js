const express = require("express");
const router = express.Router();
const controller = require("./salesPersonController");
const isAuthenticatedUser = require("../../auth/auth").isAuthenticatedUser;

router
  .route("/:id")
  .get(isAuthenticatedUser, controller.getSalesPersonById)
  .put(isAuthenticatedUser, controller.updateSalesPersonById)
  .delete(isAuthenticatedUser, controller.deleteSalesPersonById);

router
  .route("/")
  .post(isAuthenticatedUser, controller.createSalesPerson)
  .get(isAuthenticatedUser, controller.getAllSalesPersons);

module.exports = router;
