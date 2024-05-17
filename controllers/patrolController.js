const Patrol = require("../models/patrolModel");
const User = require("../models/user-model");
const mailer = require("../Emails/EmailController");
const { formatNumberWithCommas } = require("../Utils/Functions");

const createPatrol = async (req, res, next) => {
  const userid = req?.userData?.userId;
  const { name, points, startTime } = req.body;
  try {
    const patrol = new Patrol({
      user: userid,
      name,
      time: startTime,
      points,
    });

    await patrol.save();

    res.status(200).json(patrol);
  } catch (error) {
    console.error("Error creating patrol:", error);
    throw error;
  }
};

const updatePatrol = async (req, res, next) => {
  const userid = req?.userData?.userId;
  const { _id: patrolId, name, points, startTime } = req.body;
  try {
    await Patrol.findByIdAndUpdate(patrolId, {
      name,
      time: startTime,
      points,
    });

    const patrol = await Patrol.findById(patrolId);
    const userData = await User.findById(userid);

    res.status(200).json(patrol);
  } catch (error) {
    console.error("Error creating patrol:", error);
    throw error;
  }
};

const getPatrolsForUser = async (req, res, next) => {
  try {
    const userid = req?.userData?.userId;
    const patrols = await Patrol.find({ user: userid }).populate("points");
    res.status(200).json(patrols);
  } catch (error) {
    console.error("Error fetching patrols:", error);
    throw error;
  }
};

const deletePatrol = async (req, res, next) => {
  try {
    const { patrolId } = req.params;
    await Patrol.findByIdAndDelete(patrolId);
    res.status(200).json({ status: true });
  } catch (error) {
    console.error("Error deleting patrols:", error);
    throw error;
  }
};

module.exports = {
  createPatrol,
  deletePatrol,
  getPatrolsForUser,
  updatePatrol,
};
