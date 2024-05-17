const User = require("../models/user-model");
const path = require("path");

const Update__USER__PERSONAL__INFO__POST = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const { user } = req;

    const existingUserWithEmail = await User.findOne({ email: email });

    if (existingUserWithEmail && existingUserWithEmail.id !== user.id) {
      return res.status(400).json({
        status: "error",
        error: "Email already exists for a different user",
      });
    }

    const userData = await User.findById(user.id);
    userData.name = name;
    userData.email = email;
    userData.address = address;
    userData.phone = phone;

    userData.save();

    return res.json(userData);
  } catch (error) {
    console.error("Error fetching updating user:", error);
    return res
      .status(500)
      .json({ status: "error", error: "Internal server error" });
  }
};

const Update__USER__PERSONAL__IMAGE__PUT = async (req, res) => {
  try {
    const userid = req?.userData?.userId;
    const { image } = req.body;
    console.log(req?.file);

    const userData = await User.findById(userid);

    // const filePath = path.join(
    //   __dirname,
    //   `uploads/users/profile/${userData._id}`,
    //   req.file.filename
    // );

    const fileUrl = `uploads/users/profiles/${req.file.filename}`;

    if (fileUrl) {
      userData.image = fileUrl;

      userData.save();
      console.log(userData);
      return res.json(userData);
    }

    return res.status(500).json({ status: "error", error: "No Image" });
  } catch (error) {
    console.error("Error updating user image:", error);
    return res
      .status(500)
      .json({ status: "error", error: "Internal server error" });
  }
};

module.exports = {
  Update__USER__PERSONAL__INFO__POST,
  Update__USER__PERSONAL__IMAGE__PUT,
};
