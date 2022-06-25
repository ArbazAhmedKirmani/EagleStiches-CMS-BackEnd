const express = require("express");
const router = express.Router();
const controller = require("./piecesController");
const isAuthenticatedUser = require("../../auth/auth").isAuthenticatedUser;

router
  .route("/:id")
  .get(isAuthenticatedUser, controller.getPieceById)
  .put(isAuthenticatedUser, controller.updatePieceById)
  .delete(isAuthenticatedUser, controller.deletePieceById);

router
  .route("/")
  .post(isAuthenticatedUser, controller.createPiece)
  .get(isAuthenticatedUser, controller.getAllPieces);

module.exports = router;
