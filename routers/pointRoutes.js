const express = require("express");

const PointController = require("../controllers/pointController");
const Auth = require("../middleware/auth");
const pointRouter = express.Router();
pointRouter.use(Auth);

pointRouter.post("/", PointController.createPoint);
pointRouter.patch("/", PointController.updatePoint);
pointRouter.get("/", PointController.getPointsForUser);
pointRouter.delete("/:pointId", PointController.deletePoint);

module.exports = pointRouter;
