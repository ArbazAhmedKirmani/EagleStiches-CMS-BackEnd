const router = require("express").Router();

router.use("/users", require("./users/userRoutes"));
router.use("/orders", require("./orders/orderRoutes"));
// router.use("/customers", require("./customers/customerRoutes"));

module.exports = router;
