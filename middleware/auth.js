const jwt = require("jsonwebtoken");
const HttpError = require("../models/error-model");
const User = require("../models/user-model");

module.exports = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  // Check if req.headers.origin is defined before setting the header
  if (req.headers.origin) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || '*');
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      const err = new HttpError("Authorization Failed", 405);
      return next(err);
    }

    const decodedToken = jwt.verify(token, "GUARDTROL_SECRET_KEY");
    req.userData = { userId: decodedToken.userId };
    const user = await User.findById(decodedToken.userId);
    req.user = user;
    next();
  } catch (error) {
    const err = new HttpError("Authentication Error " + error, 405);
    return next(err);
  }
};
