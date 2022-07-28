const express = require("express");
const router = express.Router();
const controller = require("./quotationController");
const isAuthenticatedUser = require("../../auth/auth").isAuthenticatedUser;

router
  .route("/:id")
  .get(isAuthenticatedUser, controller.getQuotationById)
  .put(isAuthenticatedUser, controller.updateQuotationById)
  .delete(isAuthenticatedUser, controller.deleteQuotationById);

router
  .route("/")
  .post(isAuthenticatedUser, controller.createQuotation)
  .get(isAuthenticatedUser, controller.getAllQuotations);

module.exports = router;
