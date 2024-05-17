const express = require("express");
const Auth = require("../middleware/auth");
const GuardController = require("../controllers/GuardController");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/guards/profiles");
  },
  filename: (req, file, cb) => {
    const { guardId } = req.params;
    const extension = path.extname(file.originalname);
    cb(null, `${guardId}${extension}`);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.use(Auth);
router.post("/addguards", GuardController.AddGuards);
router.post("/addguard", GuardController.AddGuard);
router.post("/assignbeat/:userid", GuardController.AssignBeat);

router.get("/getguards", GuardController.GetGuards);
router.put(
  "/:guardId/image",
  upload.single("profile"),
  GuardController.Update__GUARD__IMAGE__PUT
);
router.get("/getguard/:guardid", GuardController.GetGuardByID);

router.delete("/deleteguard", GuardController.DeleteGuard);

router.patch("/verify/:guardid", GuardController.Verify);
router.patch("/comment/:guardid", GuardController.AddComment);
router.patch(
  "/personalinformation/:guardid",
  GuardController.UpdatePersonalInformation
);
router.patch("/identification/:guardid", GuardController.UpdateIdentification);
router.patch("/nextofkin/:guardid", GuardController.UpdateNextOfKin);
router.patch("/banking/:guardid", GuardController.UpdateBanking);
router.patch("/guarantor/:guardid", GuardController.UpdateGuarantor);

module.exports = router;
