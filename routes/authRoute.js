const router = require("express").Router();
const { authJwt,verifySignUp } = require("../middlewares");
const authController = require("../controllers/authController");


router.post("/signup", 
    verifySignUp.checkDuplicateUsernameOrEmail, 
    verifySignUp.checkRolesExisted,
    authController.signup
);

router.post("/refreshToken",authController.refreshToken);

router.get("/user", 
    authJwt.verifyToken, 
    authController.getUser
);

router.post("/login", authController.login);

router.post("/logout", 
    authJwt.verifyToken, 
    authController.logout
);

module.exports = router;