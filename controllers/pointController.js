const Point = require("../models/pointModel");
const User = require("../models/user-model");
const mailer = require("../Emails/EmailController");
const { formatNumberWithCommas } = require("../Utils/Functions");

const createPoint = async (req, res, next) => {
  const userid = req?.userData?.userId;
  const { name, coordinates, imageUrl } = req.body;
  try {
    const point = new Point({
      user: userid,
      name,
      coordinates,
      imageUrl,
    });

    await point.save();

    // await mailer.sendPointMail({
    //   name: userData.name,
    //   subject: "Guardtrol Point",
    //   email: userData.email,
    //   plan,
    //   date: point.createdat.toLocaleDateString(),
    //   title: "Point Successful",
    //   beats: point.maxbeats,
    //   amount: `₦${formatNumberWithCommas(totalamount)}`,
    // });

    res.status(200).json(point);
  } catch (error) {
    console.error("Error creating point:", error);
    throw error;
  }
};

const updatePoint = async (req, res, next) => {
  const userid = req?.userData?.userId;
  const { _id: pointId, name, coordinates, imageUrl } = req.body;
  try {
    await Point.findByIdAndUpdate(pointId, {
      user: userid,
      name,
      coordinates,
      imageUrl,
    });

    const point = await Point.findById(pointId);
    const userData = await User.findById(userid);

    // await mailer.sendPointMail({
    //   name: userData.name,
    //   subject: "Guardtrol Point Update",
    //   email: userData.email,
    //   plan: plan ? plan : "",
    //   date: point.createdat.toLocaleDateString(),
    //   title: "Point Update Successful",
    //   beats: point.maxbeats,
    //   amount: `₦${formatNumberWithCommas(totalamount)}`,
    // });

    res.status(200).json(point);
  } catch (error) {
    console.error("Error creating point:", error);
    throw error;
  }
};

const getPointsForUser = async (req, res, next) => {
  try {
    const userid = req?.userData?.userId;
    const points = await Point.find({ user: userid });
    res.status(200).json(points);
  } catch (error) {
    console.error("Error fetching points:", error);
    throw error;
  }
};
const deletePoint = async (req, res, next) => {
  try {
    const { pointId } = req.params;
    await Point.findByIdAndDelete(pointId);
    res.status(200).json({ status: true });
  } catch (error) {
    console.error("Error deleting points:", error);
    throw error;
  }
};

module.exports = {
  createPoint,
  deletePoint,
  getPointsForUser,
  updatePoint,
};
