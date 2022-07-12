const router = require("express").Router();
const { authJwt } = require("../middlewares");
const criteriaLevelController = require("../controllers/criteriaLevelController");


router.post("/create",
    authJwt.verifyToken,
    criteriaLevelController.create
);

router.get("/show",
    authJwt.verifyToken,
    criteriaLevelController.showAllCriteria
);

module.exports = router;