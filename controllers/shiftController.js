// shiftService.js

const { ObjectId } = require("mongodb");
const Shift = require("../models/ShiftModel");

// Import necessary dependencies

// Function to create a new shift
const createShift = async (req, res, next) => {
  const userid = req?.userData?.userId;
  const { name, start, end } = req.body;
  try {
    const shift = new Shift({
      user: userid,
      name,
      start,
      end,
    });
    await shift.save();
    res.status(200).json(shift);
  } catch (error) {
    console.error("Error creating shift:", error);
    throw error;
  }
};
const getShiftsForUser = async (req, res, next) => {
  // Function to retrieve shifts for a user

  try {
    const userid = req?.userData?.userId;
    const shifts = await Shift.find({ user: userid });
    res.status(200).json(shifts);
  } catch (error) {
    console.error("Error fetching shifts:", error);
    throw error;
  }
};

const DeleteShift = async (req, res, next) => {
  const { shiftId } = req.params;

  try {
    await Shift.findByIdAndDelete(shiftId);

    res
      .status(201)
      .json({ mesage: "Shift Deleted Successfully", status: true });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Error Deleting Shift " + err, 401);
    return next(error);
  }
};

const UpdateShift = async (req, res, next) => {
  const { shiftId } = req.params;
  const { name, start, end } = req.body;

  try {
    await Shift.findByIdAndUpdate(shiftId, { name, start, end });

    res
      .status(201)
      .json({ mesage: "Shift Updated Successfully", status: true });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Error Deleting Shift " + err, 401);
    return next(error);
  }
};

module.exports = {
  getShiftsForUser,
  createShift,
  DeleteShift,
  UpdateShift,
};
