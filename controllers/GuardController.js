const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("../models/error-model");
const mailer = require("../Emails/EmailController");
//models
const User = require("../models/user-model");
const Beat = require("../models/BeatModel");
const Guard = require("../models/GuardModel");
const BeatModel = require("../models/BeatModel");
const GuardModel = require("../models/GuardModel");
const path = require("path");
const fs = require("fs");
const uploadsDir = path.join(__dirname, "..", "uploads", "guards", "profiles");

const app = express();
app.use(bodyParser.json());

const AddGuards = async (req, res, next) => {
  const userid = req?.userData?.userId;
  const guards = req.body;
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
    const createdGuards = await Promise.all(
      guards.map(async (guard) => {
        const newGuard = new Guard({
          name: guard.full_name,
          phone: guard.phone,

          user: user._id,
        });

        const savedGuard = await newGuard.save();
        user.guards = [...user.guards, savedGuard._id];
        return savedGuard;
      })
    );

    await user.save();
    await mailer.sendNotificationMail({
      email: user.email,
      name: user.name,
      header: `${guards.length} New Guard${
        guards.length > 1 ? "s" : ""
      } Added!`,
      subject: `${guards.length} New Guard${
        guards.length > 1 ? "s" : ""
      } Added!`,
      message1: `${guards.length} New Guard${
        guards.length > 1 ? "s" : ""
      } Have Been Added To Your Company Instance.`,
      message2:
        "If you encounter any inconvenience, don't hesitate to reach out to our support team",
      title: `${guards.length} New Guard${
        guards.length > 1 ? "s" : ""
      } Has Been Added`,
    });
    res.status(201).json(createdGuards);
  } catch (error) {
    const err = new HttpError("Could Not Create Guards " + error, 500);
    return next(err);
  }
};
const AddGuard = async (req, res, next) => {
  const userid = req?.userData?.userId;

  const { full_name, phone } = req.body;

  let user;
  try {
    const newGuard = new Guard({
      name: full_name,
      phone: phone,
      user: userid,
    });

    user = await User.findById(userid);

    if (!user) {
      const error = new HttpError("Invalid User", 401);
      return next(error);
    }

    const savedGuard = await newGuard.save();
    user.guards = [...user.guards, savedGuard._id];

    await user.save();
    await mailer.sendNotificationMail({
      email: user.email,
      name: user.name,
      header: `1 New Guard 1 Added!`,
      subject: `1 New Guard 1 Added!`,
      message1: `1 New Guard has Been Added To Your Company Instance.`,
      message2:
        "If you encounter any inconvenience, don't hesitate to reach out to our support team",
      title: `1 New Guard 1 Has Been Added`,
    });
    res.status(201).json(savedGuard);
  } catch (error) {
    const err = new HttpError("Could Not Create Guards " + error, 500);
    return next(err);
  }
};

const AssignBeat = async (req, res, next) => {
  const userid = req.params.userid;
  const { beat, guards } = req.body;
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
    const err = new HttpError("Could Not Connect to Beat" + error, 401);
    return next(err);
  }
  if (!thisBeat) {
    const error = new HttpError("Beat Not Found", 401);
    return next(error);
  }
  try {
    guards.map(async (guard) => {
      thisBeat.guards = [...thisBeat.guards, guard._id];
    });

    await thisBeat.save();
    await mailer.sendNotificationMail({
      email: user.email,
      name: user.name,
      header: `${guards.length} New Guard${guards.length > 1 ? "s" : ""} ${
        guards.length > 1 ? "Were" : "Was"
      } Assigned to ${beat.name} Beat`,
      subject: `${guards.length} New Guard${guards.length > 1 ? "s" : ""} ${
        guards.length > 1 ? "Were" : "Was"
      } Assigned to Beat!`,
      message1: `${guards.length} New Guard${guards.length > 1 ? "s" : ""} ${
        guards.length > 1 ? "Were" : "Was"
      } Assigned to ${beat.name}`,
      message2:
        "If you encounter any inconvenience, don't hesitate to reach out to our support team",
      title: `${guards.length} New Guard${
        guards.length > 1 ? "s" : ""
      } Have Been Added`,
    });
    res.status(201).json(thisBeat);
  } catch (error) {
    const err = new HttpError("Could Not Assign Guards to Beat" + error, 500);
    return next(err);
  }
};
const GetGuards = async (req, res, next) => {
  const userid = req?.userData?.userId;

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
    const userGuards = await GuardModel.find({ user: userid });

    res.status(200).json(userGuards);
  } catch (error) {
    const err = new HttpError("Error Fetching Guards " + error, 401);
    return next(error);
  }
};

const GetGuardByID = async (req, res, next) => {
  const guardid = req.params.guardid;
  let guard;
  try {
    guard = await GuardModel.findById(guardid);
  } catch (error) {
    const err = new HttpError("Could Not Connect " + error, 401);
    return next(err);
  }
  if (!guard) {
    const error = new HttpError("No Guard Found", 401);
    return next(error);
  }
  try {
    res.status(200).json(guard);
  } catch (error) {
    const err = new HttpError("Error Fetching Guard " + error, 401);
    return next(error);
  }
};
const DeleteGuard = async (req, res, next) => {
  const guardId = req.body._id;

  try {
    const guard = await Guard.findById(guardId);
    if (!guard) {
      const error = new HttpError("Guard Not Found ", 401);
      return next(error);
    }

    // Step 2: Remove the guard reference from the user document
    await User.updateMany({ guards: guardId }, { $pull: { guards: guardId } });

    // Step 3: Remove the guard reference from the beat document
    await Beat.updateMany({ guards: guardId }, { $pull: { guards: guardId } });

    // Step 4: Delete the guard document itself
    await Guard.deleteOne({ _id: guardId });
    res
      .status(201)
      .json({ mesage: "Guard Deleted Successfully", status: true });
  } catch (err) {
    const error = new HttpError("Error Deleting Guard " + err, 401);
    return next(error);
  }
};

const Update__GUARD__IMAGE__PUT = async (req, res) => {
  try {
    const userid = req?.userData?.userId;
    const { guardId } = req.body;
    const guardData = await Guard.findById(guardId);

    if (!req.file) {
      return res
        .status(400)
        .json({ status: "error", error: "No file uploaded" });
    }
    console.log("req.file.filename", req.file.filename);

    if (
      guardData.profileImage &&
      guardData.profileImage !== "uploads/guards/profiles/guard.png"
    ) {
      const oldImagePath = path.join(guardData.profileImage);
      console.log(uploadsDir);
      // fs.unlink(oldImagePath, (err) => {
      //   if (err) {
      //     console.error("Error deleting old image:", err);
      //   }
      // });
    }

    const fileUrl = `uploads/guards/profiles/${req.file.filename}`;
    guardData.profileImage = fileUrl;
    await guardData.save();
    console.log(guardData);
    return res.json(guardData);
  } catch (error) {
    console.error("Error updating user image:", error);
    return res
      .status(500)
      .json({ status: "error", error: "Internal server error" });
  }
};
const Verify = async (req, res, next) => {
  const guardid = req.params.guardid;
  const { status } = req.body;

  Guard.findByIdAndUpdate(
    guardid,
    { isactive: status },
    { new: true, useFindAndModify: false }
  )
    .then((updatedGuard) => {
      res.status(201).json({ status: true });
    })
    .catch((err) => {
      const error = new HttpError("Could Not Verify Guard" + err, 401);
      return next(error);
    });
};

const AddComment = async (req, res, next) => {
  const guardid = req.params.guardid;
  const { comment, updatedat } = req.body;
  // let guard
  // try {
  //     guard = await GuardModel.findById(guardid)

  // } catch (error) {
  //     const err = new HttpError("Could Not Connect "+error, 401)
  //     return next(err)
  // }
  // if (!guard) {
  //     const error = new HttpError('No Guard Found', 401)
  //     return next(error)
  // }
  Guard.findByIdAndUpdate(
    guardid,
    {
      comment: {
        comment,
        updatedat,
      },
    },
    { new: true, useFindAndModify: false }
  )
    .then((updatedGuard) => {
      res.status(201).json({ status: true });
    })
    .catch((err) => {
      const error = new HttpError("Could Not Add Comment" + err, 401);
      return next(error);
    });
};

const UpdatePersonalInformation = async (req, res, next) => {
  const guardid = req.params.guardid;

  Guard.findByIdAndUpdate(
    guardid,
    { personalinformation: req.body },
    { new: true, useFindAndModify: false }
  )
    .then((updatedGuard) => {
      res.status(201).json({ status: true });
    })
    .catch((err) => {
      const error = new HttpError("Could Not Add Comment" + err, 401);
      return next(error);
    });
};

const UpdateIdentification = async (req, res, next) => {
  const guardid = req.params.guardid;

  Guard.findByIdAndUpdate(
    guardid,
    { identification: req.body },
    { new: true, useFindAndModify: false }
  )
    .then((updatedGuard) => {
      res.status(201).json({ status: true });
    })
    .catch((err) => {
      const error = new HttpError("Could Not Update Identification" + err, 401);
      return next(error);
    });
};

const UpdateNextOfKin = async (req, res, next) => {
  const guardid = req.params.guardid;

  Guard.findByIdAndUpdate(
    guardid,
    { nextofkin: req.body },
    { new: true, useFindAndModify: false }
  )
    .then((updatedGuard) => {
      res.status(201).json({ status: true });
    })
    .catch((err) => {
      const error = new HttpError("Could Not Update Next Of Kin" + err, 401);
      return next(error);
    });
};
const UpdateBanking = async (req, res, next) => {
  const guardid = req.params.guardid;

  Guard.findByIdAndUpdate(
    guardid,
    { banking: req.body },
    { new: true, useFindAndModify: false }
  )
    .then((updatedGuard) => {
      res.status(201).json({ status: true });
    })
    .catch((err) => {
      const error = new HttpError(
        "Could Not Update Banking Information" + err,
        401
      );
      return next(error);
    });
};

const UpdateGuarantor = async (req, res, next) => {
  const guardid = req.params.guardid;

  Guard.findByIdAndUpdate(
    guardid,
    { guarantor: req.body },
    { new: true, useFindAndModify: false }
  )
    .then((updatedGuard) => {
      res.status(201).json({ status: true });
    })
    .catch((err) => {
      const error = new HttpError(
        "Could Not Update Guarantor Information" + err,
        401
      );
      return next(error);
    });
};

exports.AddGuards = AddGuards;
exports.AddGuard = AddGuard;
exports.AssignBeat = AssignBeat;
exports.GetGuards = GetGuards;
exports.DeleteGuard = DeleteGuard;
exports.GetGuardByID = GetGuardByID;
exports.Update__GUARD__IMAGE__PUT = Update__GUARD__IMAGE__PUT;
exports.Verify = Verify;
exports.AddComment = AddComment;
exports.UpdatePersonalInformation = UpdatePersonalInformation;
exports.UpdateIdentification = UpdateIdentification;
exports.UpdateNextOfKin = UpdateNextOfKin;
exports.UpdateBanking = UpdateBanking;
exports.UpdateGuarantor = UpdateGuarantor;
