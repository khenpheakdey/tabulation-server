const router = require("express").Router();
const { authJwt } = require("../middlewares");
const criteriaController = require("../controllers/criteriaController");

router.post("/create",
    authJwt.verifyToken,
    authJwt.isAdmin,
    criteriaController.createCriteria
);

router.get("/show", 
    authJwt.verifyToken,
    criteriaController.getCriterion
);

router.get("/showByCategory",
    authJwt.verifyToken,
    criteriaController.showByCategory
)

router.get("/showOne",
    authJwt.verifyToken,
    criteriaController.getByFieldAndEvent
);

module.exports = router;