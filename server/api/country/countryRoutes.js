const express = require("express");
const router = express.Router();
const controller = require("./countryController");
const isAuthenticatedUser = require("../../auth/auth").isAuthenticatedUser;

router
  .route("/:id")
  .get(isAuthenticatedUser, controller.getCountryById)
  .put(isAuthenticatedUser, controller.updateCountryById)
  .delete(isAuthenticatedUser, controller.deleteCountryById);

router
  .route("/")
  .post(isAuthenticatedUser, controller.createCountry)
  .get(isAuthenticatedUser, controller.getAllCountry);

module.exports = router;
