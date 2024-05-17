const express = require("express");

const PatrolController = require("../controllers/patrolController");
const Auth = require("../middleware/auth");
const patrolRouter = express.Router();
patrolRouter.use(Auth);

patrolRouter.post("/", PatrolController.createPatrol);
patrolRouter.patch("/", PatrolController.updatePatrol);
patrolRouter.get("/", PatrolController.getPatrolsForUser);
patrolRouter.delete("/:patrolId", PatrolController.deletePatrol);

module.exports = patrolRouter;
