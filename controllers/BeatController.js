const express = require("express");
const bodyParser = require("body-parser");
const User = require("../models/user-model");
const Beat = require("../models/BeatModel");
const HttpError = require("../models/error-model");
const mailer = require("../Emails/EmailController");
const GuardModel = require("../models/GuardModel");
const { model } = require("mongoose");
const BeatModel = require("../models/BeatModel");

const app = express();
app.use(bodyParser.json());

const AddBeats = async (req, res, next) => {
  const userid = req.params.userid;
  const beats = req.body;
  let user;
  try {
    user = await User.findById(userid);
  } catch (error) {
    const err = new HttpError("Could Not Connect " + error, 401);
    return next(err);
  }
  if (!user) {
    const error = new HttpError("Invalid User", 401);
    return next(error);
  }

  try {
    const createdBeats = await Promise.all(
      beats.map(async (beat) => {
        const newBeat = new Beat({
          name: beat.beat_name,
          address: beat.address,
          description: beat.description,
          user: user._id,
        });

        const savedBeat = await newBeat.save();
        user.beats = [...user.beats, savedBeat._id];
        return savedBeat;
      })
    );

    await user.save();
    await mailer.sendNotificationMail({
      email: user.email,
      name: user.name,
      header: `${beats.length} New Beat${beats.length > 1 ? "s" : ""} Added!`,
      subject: `${beats.length} New Beat${beats.length > 1 ? "s" : ""} Added!`,
      message1: `${beats.length} New Beat${
        beats.length > 1 ? "s" : ""
      } Has Been Added To Your Company Instance.`,
      message2:
        "If you encounter any inconvenience, don't hesitate to reach out to our support team",
      title: `${beats.length} New Beat${
        beats.length > 1 ? "s" : ""
      } Has Been Added`,
    });

    res.status(201).json(createdBeats);
  } catch (error) {
    const err = new HttpError("Could not create beats " + error, 500);
    return next(err);
  }
};

const AddBeat = async (req, res, next) => {
  const userid = req?.userData?.userId;
  const beat = req.body;
  let user;
  try {
    user = await User.findById(userid);
  } catch (error) {
    const err = new HttpError("Could Not Connect " + error, 401);
    return next(err);
  }
  if (!user) {
    const error = new HttpError("Invalid User", 401);
    return next(error);
  }

  try {
    const newBeat = new Beat({
      name: beat.name,
      address: beat.address,
      description: beat.description,
      user: user._id,
    });

    const savedBeat = await newBeat.save();
    user.beats = [...user.beats, savedBeat._id];

    await user.save();
    await mailer.sendNotificationMail({
      email: user.email,
      name: user.name,
      header: `1 New Beat Added!`,
      subject: `1 New Beat Added!`,
      message1: `1 Beat Has Been Added To Your Company Instance.`,
      message2:
        "If you encounter any inconvenience, don't hesitate to reach out to our support team",
      title: `1 New Beat Has Been Added`,
    });

    res.status(201).json({ status: true });
  } catch (error) {
    const err = new HttpError("Could not create beat " + error, 500);
    return next(err);
  }
};

const EditBeat = async (req, res, next) => {
  const userid = req.params.userid;
  const beat = req.body;
  let editedBeat;
  try {
    editedBeat = await Beat.findById(beat._id);
  } catch (error) {
    const err = new HttpError("Could Not Connect " + error, 401);
    return next(err);
  }
  if (!editedBeat) {
    const error = new HttpError("Beat Not Found", 401);
    return next(error);
  }

  try {
    editedBeat.name = beat.name;
    editedBeat.address = beat.address;
    editedBeat.description = beat.description;
    await editedBeat.save();
    res.status(201).json({ status: true });
  } catch (error) {
    const err = new HttpError("Could not Edit Beat " + error, 500);
    return next(err);
  }
};

const GetBeats = async (req, res, next) => {
  const userid = req?.userData?.userId;

  let user;
  try {
    user = await User.findById(userid)
      .populate({
        path: "beats",
        model: BeatModel,
        populate: { path: "guards", model: GuardModel }, // Populate the 'guards' field of each beat
      })
      .populate({ path: "guards", model: GuardModel });
  } catch (error) {
    const err = new HttpError("Could Not Connect " + error, 401);
    return next(err);
  }
  if (!user) {
    const error = new HttpError("Invalid User", 401);
    return next(error);
  }

  try {
    res.status(201).json(user);
  } catch (error) {
    const err = new HttpError("Could not create beats " + error, 500);
    return next(err);
  }
};

const DeleteGuardsAssigned = async (req, res, next) => {
  const userid = req.params.userid;
  const { beat } = req.body;
  let user;
  try {
    user = await User.findById(userid);
  } catch (error) {
    const err = new HttpError("Could Not Connect " + error, 401);
    return next(err);
  }
  if (!user) {
    const error = new HttpError("Invalid User", 401);
    return next(error);
  }
  let thisBeat;
  try {
    thisBeat = await BeatModel.findById(beat._id);
  } catch (error) {
    const err = new HttpError("Could Not Connect " + error, 401);
    return next(err);
  }
  if (!thisBeat) {
    const error = new HttpError("Beat Not Found", 401);
    return next(error);
  }

  try {
    thisBeat.guards = [];
    await thisBeat.save();
    await mailer.sendNotificationMail({
      email: user.email,
      name: user.name,
      header: `${beat.guards.length} Guard${
        beat.guards.length > 1 ? "s" : ""
      } ${beat.guards.length > 1 ? "Were" : "Was"} Deleted from ${
        beat.name
      } Beat`,
      subject: `${beat.guards.length} Guard${
        beat.guards.length > 1 ? "s" : ""
      } ${beat.guards.length > 1 ? "Were" : "Was"} Deleted From Beat!`,
      message1: `${beat.guards.length} Guard${
        beat.guards.length > 1 ? "s" : ""
      } ${beat.guards.length > 1 ? "Were" : "Was"} Deleted From ${beat.name}`,
      message2:
        "If you did not perform this action, don't hesitate to reach out to our support team",
      title: `${beat.guards.length} Guard${
        beat.guards.length > 1 ? "s" : ""
      } Deleted From Beat`,
    });
    res.status(201).json({
      message: `All Assigned Guards Have Been Deleted From ${beat.name}`,
    });
  } catch (error) {
    const err = new HttpError("Could not Delete beats " + error, 500);
    return next(err);
  }
};

const DeleteBeat = async (req, res, next) => {
  const beatId = req.body.beatId;

  try {
    const beat = await Beat.findById(beatId);
    if (!beat) {
      const error = new HttpError("Beat Not Found ", 401);
      return next(error);
    }

    await User.updateMany({ beats: beatId }, { $pull: { beats: beatId } });

    await Beat.deleteOne({ _id: beatId });
    res.status(201).json({ mesage: "Beat Deleted Successfully", status: true });
  } catch (err) {
    const error = new HttpError("Error Deleting Beat " + err, 401);
    return next(error);
  }
};

exports.AddBeats = AddBeats;
exports.AddBeat = AddBeat;
exports.GetBeats = GetBeats;
exports.DeleteGuardsAssigned = DeleteGuardsAssigned;
exports.DeleteBeat = DeleteBeat;
exports.EditBeat = EditBeat;
