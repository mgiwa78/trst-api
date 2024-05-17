const express = require("express");
const Auth = require("../middleware/auth");
const BeatController = require("../controllers/BeatController");

const router = express.Router();

router.use(Auth);
router.post("/addbeats/:userid", BeatController.AddBeats);
router.post("/addbeat", BeatController.AddBeat);

router.patch("/editbeat/:userid", BeatController.EditBeat);

router.get("/getbeats", BeatController.GetBeats);

router.delete(
  "/deletguardsassigned/:userid",
  BeatController.DeleteGuardsAssigned
);
router.delete("/deletebeat", BeatController.DeleteBeat);

module.exports = router;
