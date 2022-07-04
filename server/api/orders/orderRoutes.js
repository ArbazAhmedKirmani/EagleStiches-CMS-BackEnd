const express = require("express");
const router = express.Router();
const controller = require("./orderController");
const isAuthenticatedUser = require("../../auth/auth").isAuthenticatedUser;

router
  .route("/:id")
  .get(isAuthenticatedUser, controller.getOrderById)
  .put(isAuthenticatedUser, controller.updateOrderById)
  .delete(isAuthenticatedUser, controller.deleteOrderById);

  router
    .route("/")
    .post(isAuthenticatedUser, controller.createOrder)
    .get(isAuthenticatedUser, controller.getAllOrders);

    router
      .route("/status/:id")
      .put(isAuthenticatedUser, controller.updateOrderStatusById)

module.exports = router;
