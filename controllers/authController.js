const Card = require("../models/card");
const HttpError = require("../models/error-model");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

const Change_Password__USER__Put = async (req, res) => {
  try {
    const { currentPassword, newPassword, email } = req.body;
    const userData = req.user;
    console.log(userData);
    const user = await User.findOne({ email: userData.email });

    let isValidPassword = false;
    if (null === user.password || !user.password) {
      isValidPassword = true; //for google users who wants to add a password
    } else {
      try {
        isValidPassword = await bcrypt.compare(currentPassword, user.password);
      } catch (error) {
        const err = new HttpError("There Was An Error " + error, 500);
        return next(err);
      }
    }
    //isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (isValidPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      user.save();
      return res.json({ status: "success" });
    } else {
      return res
        .status(401)
        .json({ status: "error", error: "Invalid Password" });
    }
  } catch (error) {
    console.error("Error fetching cards:", error);
    return res
      .status(500)
      .json({ status: "error", error: "Internal server error" });
  }
};

module.exports = {
  Change_Password__USER__Put,
};
