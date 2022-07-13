const router = require("express").Router();
const { authJwt } = require("../middlewares");
const groupScoreController = require("../controllers/groupScoreController");


router.post("/create",
    authJwt.verifyToken,
    authJwt.isExaminer,
    groupScoreController.createScore
);

router.get("/getScore", 
    authJwt.verifyToken,
    groupScoreController.getScore
);

router.get("/getLatest", 
    authJwt.verifyToken,
    groupScoreController.getLatest
);

router.post("/createScores", authJwt.verifyToken,groupScoreController.createScores);


module.exports = router;