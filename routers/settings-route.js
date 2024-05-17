const { Router } = require("express");
const {
  Update__USER__PERSONAL__INFO__POST,
  Update__USER__PERSONAL__IMAGE__PUT,
} = require("../controllers/settingsController");
const auth = require("../middleware/auth");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/users/profiles/");
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, `${basename}-${Date.now()}${extension}`);
  },
});

const upload = multer({ storage: storage });
const settingsRouter = Router();

settingsRouter.use(auth);
settingsRouter.put("/personal-information", Update__USER__PERSONAL__INFO__POST);

settingsRouter.put(
  "/personal-image",
  upload.single("profile"),
  Update__USER__PERSONAL__IMAGE__PUT
);

module.exports = { settingsRouter };
