const express = require("express");
const router = express.Router();
const controller = require("./invoiceController");
const isAuthenticatedUser = require("../../auth/auth").isAuthenticatedUser;

router.route("/:id").get(isAuthenticatedUser, controller.getInvoiceById);

router
  .route("/")
  .post(isAuthenticatedUser, controller.createInvoices)
  .get(isAuthenticatedUser, controller.getAllInvoices);

module.exports = router;
