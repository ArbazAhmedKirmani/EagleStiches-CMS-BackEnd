const router = require("express").Router();
const controller = require("./controller");
const verifyUser = require("./auth").verifyUser;

router.post("/signin", verifyUser, controller.signin);
router.post("/signup", controller.signup);
router.post("/reset-password", controller.resetPassword);

module.exports = router;
