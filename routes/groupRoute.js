const router = require("express").Router();
const { authJwt } = require("../middlewares");
const groupController = require("../controllers/groupController");

router.post("/create",
    authJwt.verifyToken,
    authJwt.isAdmin,
    groupController.createGroup
);

router.get("/get",authJwt.verifyToken, groupController.get);
router.delete("/delete", authJwt.verifyToken, groupController.delete);

router.get("/getByEvent",
    authJwt.verifyToken,
    groupController.getByEvent
)

module.exports = router;