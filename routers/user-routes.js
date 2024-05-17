const express = require("express");
const UserController = require("../controllers/user-controller");
const { check } = require("express-validator");
const Auth = require("../middleware/auth");

const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.post("/signup", check("name").not().isEmpty(), UserController.SignUp);
router.post("/signin", check("email").not().isEmpty(), UserController.SignIn);
router.post(
  "/signupwithgoogle",
  check("name").not().isEmpty(),
  UserController.GoogleSignUp
);

router.post(
  "/signinwithgoogle",
  check("email").not().isEmpty(),
  UserController.GoogleSignIn
);
router.post("/forgotpassword", UserController.forgotPassword);
router.patch("/resetpassword", UserController.resetPassword);

router.use(Auth);

router.post("/subscribe/:userid", UserController.Subscribe);

router.patch(
  "/update/:client/image",
  fileUpload.single("image"),
  UserController.updateUserImage
);
router.patch("/update/:client/email", UserController.updateUserEmail);
router.patch("/update/:client/password", UserController.updateUserPassword);
router.patch("/finishonboarding/:userid", UserController.FinishOnboarding);

router.post("/:userid/verifyemail", UserController.verifyEmail);

router.get("/getuser/:userid", UserController.getUser);
router.get("/getsubscription", UserController.getUserSubscription);
router.get("/getallsubscription", UserController.getAllSubscription);
router.get("/:userid/checkverifyemail", UserController.checkVerifyEmail);

module.exports = router;
