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

const app = express();
app.use(bodyParser.json());


const GetGuards = async (req, res, next) => {
    const beatId = req?.params?.beatid;

    
    
    let beat;
    try {
      beat = await Beat.findById(beatId)
      .populate({ path: "guards", model: GuardModel });
    } catch (error) {
      const err = new HttpError("Could Not Connect " + error, 401);
      return next(err);
    }
    if (!beat) {
      const error = new HttpError("Invalid Beat", 401);
      return next(error);
    }
    beat.isactive = true;
    await beat.save();
    try {
      //const beatGuards = await GuardModel.find({ beat: beatId });
      console.log(beat.guards)
      res.status(200).json(beat.guards);
    } catch (error) {
      const err = new HttpError("Error Fetching Guards " + error, 401);
      return next(error);
    }
  };


  exports.GetGuards = GetGuards;