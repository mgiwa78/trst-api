const express = require("express");
const Auth = require("../middleware/auth");
const MobileController = require("../controllers/mobileController");

const router = express.Router();

router.use(Auth);
// router.post("/addbeats/:userid", BeatController.AddBeats);
// router.post("/addbeat", BeatController.AddBeat);

// router.patch("/editbeat/:userid", BeatController.EditBeat);

router.get("/getguards/:beatid", MobileController.GetGuards);

// router.delete(
//   "/deletguardsassigned/:userid",
//   BeatController.DeleteGuardsAssigned
// );
// router.delete("/deletebeat", BeatController.DeleteBeat);

module.exports = router;
