const router = require("express").Router();

router.use("/users", require("./users/userRoutes"));
router.use("/orders", require("./orders/orderRoutes"));
// router.use("/customers", require("./customers/customerRoutes"));
router.use("/format", require("./formats/formatRoutes"));
router.use("/patchcategory", require("./patchCategory/patchCategoryReoutes"));
router.use("/placement", require("./placement/placementRoutes"));
router.use("/unit", require("./units/unitsRoutes"));
router.use("/salesPerson", require("./salesPerson/salesPersonRoutes"));
router.use("/pieces", require("./pieces/piecesRoutes"));
router.use("/invoices", require("./Invoices/inoiceRoutes"));
router.use("/quotation", require("./quotations/quotationRoutes"));

module.exports = router;
