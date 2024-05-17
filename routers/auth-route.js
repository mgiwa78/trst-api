const { Router } = require("express");

const { Change_Password__USER__Put } = require("../controllers/authController");

const authRouter = Router();
const auth = require("../middleware/auth");

authRouter.use(auth);
authRouter.put("/update-password", Change_Password__USER__Put);

module.exports = { authRouter };
