const router = require("express").Router();
const { authJwt } = require("../middlewares");
const candidateController = require("../controllers/candidateController");


router.post("/create",
    authJwt.verifyToken,
    authJwt.isAdmin,
    candidateController.create
);

router.get("/get",
    authJwt.verifyToken,
    candidateController.get
);


router.put("/update",authJwt.verifyToken, candidateController.update);

router.delete("/delete",authJwt.verifyToken, candidateController.delete);

router.get("/showOne",authJwt.verifyToken, candidateController.showOne);

router.get("/getByEvent", authJwt.verifyToken,candidateController.getByEvent);



module.exports = router;