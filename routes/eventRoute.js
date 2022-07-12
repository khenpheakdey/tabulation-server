const router = require("express").Router();
const { authJwt } = require("../middlewares");
const eventController = require("../controllers/eventController");

router.post("/create",
    authJwt.verifyToken,
    authJwt.isAdmin,eventController.createEvent
);

router.get("/show", 
    authJwt.verifyToken,
    eventController.getEvents
);

router.get("/upcoming",authJwt.verifyToken,eventController.upcomingEvent);

router.get("/showOne",authJwt.verifyToken,eventController.getById);

router.put("/update",authJwt.verifyToken,eventController.update);

router.delete("/delete",authJwt.verifyToken,eventController.delete);

router.get("/getByExaminer",authJwt.verifyToken,eventController.getEventByExaminer)

router.get("/all", 
    authJwt.verifyToken, 
    eventController.getNumberOfEvents
);

module.exports = router;