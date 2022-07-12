const router = require("express").Router();
const { authJwt } = require("../middlewares");
const individualScoreController = require("../controllers/individualScoreController");


router.post("/create",
    authJwt.verifyToken,
    authJwt.isExaminer,
    individualScoreController.createScore
);

router.get("/getScore", 
    authJwt.verifyToken,
    individualScoreController.getScore
);

router.post("/createScores", authJwt.verifyToken,individualScoreController.createScores);


module.exports = router;