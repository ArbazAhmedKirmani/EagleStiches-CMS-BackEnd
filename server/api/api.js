const router = require("express").Router();

router.use("/users", require("./users/userRoutes"));
// router.use("/categories", require("./categories/categoriesRoutes"));

module.exports = router;
