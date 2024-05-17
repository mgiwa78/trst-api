const express = require("express");

const ShiftController = require("../controllers/shiftController");
const Auth = require("../middleware/auth");
const shiftRouter = express.Router();
shiftRouter.use(Auth);

shiftRouter.post("/", ShiftController.createShift);
shiftRouter.get("/", ShiftController.getShiftsForUser);
shiftRouter.delete("/:shiftId", ShiftController.DeleteShift);
shiftRouter.put("/:shiftId", ShiftController.UpdateShift);

module.exports = shiftRouter;
