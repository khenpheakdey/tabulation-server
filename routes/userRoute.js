const router = require("express").Router();
const { authJwt } = require("../middlewares");
const userController = require("../controllers/userController");

router.get("/getExaminers",
    authJwt.verifyToken,
    authJwt.isAdmin,
    userController.getExaminers
);

router.get("/showOne",authJwt.verifyToken, userController.getOneExaminer);

module.exports = router;