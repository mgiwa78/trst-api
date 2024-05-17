const express = require("express");
const bodyParser = require("body-parser");
const User = require("../models/user-model");
const Subscription = require("../models/subscriptionModel");
const HttpError = require("../models/error-model");
const https = require("https");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailer = require("../Emails/EmailController");
const {
  sendVerificationMail,
  sendWelcomeMail,
  sendPasswordResetLink,
  sendPasswordResetSuccessMail,
  sendNotificationMail,
} = require("../Emails/EmailController");
const BeatModel = require("../models/BeatModel");
const GuardModel = require("../models/GuardModel");
const { formatNumberWithCommas } = require("../Utils/Functions");

const app = express();
app.use(bodyParser.json());

const SignUp = async (req, res, next) => {
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(req.body.password, 12);
  } catch (error) {
    const err = new HttpError(error, 500);
    return next(err);
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: hashedPassword,
  });
  let existingUser;
  try {
    existingUser = await User.findOne({ email: user.email });
  } catch (err) {
    const error = new HttpError("an error occured", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "this user already exists , login instead",
      500
    );
    return next(error);
  }
  let savedUser;
  try {
    savedUser = await user.save();
  } catch (error) {
    console.log(error);
    const err = new HttpError("Couldnt Save This User " + error, 500);
    return next(err);
  }

  await sendWelcomeMail({ name: user.name, email: user.email });

  let token;

  try {
    token = jwt.sign(
      { userId: savedUser.id, email: savedUser.email },
      "GUARDTROL_SECRET_KEY"
    );
    // token = jwt.sign(
    //   { userId: savedUser.id, email: savedUser.email },
    //   "GUARDTROL_SECRET_KEY",
    //   { expiresIn: "10h" }
    // );

    res.status(201).json({
      token: token,
      userid: savedUser._id,
      email: savedUser.email,
      emailverified: savedUser.emailverified,
      name: savedUser.name,
      clientid: savedUser.clientid,
      image: savedUser.image,
      emailverified: savedUser.emailverified,
      onboardingcomplete: savedUser.onboardingcomplete,
    });
  } catch (error) {
    const err = new HttpError("Signup Failed" + error, 500);
    return next(err);
  }
};

const GoogleSignUp = async (req, res, next) => {
  const { data } = req.body;
  const user = new User({
    name: data.name,
    email: data.email,
    image: data.picture,
    emailverified: true,
  });
  let existingUser;
  try {
    existingUser = await User.findOne({ email: user.email });
  } catch (err) {
    const error = new HttpError("An Error Occured" + err, 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "This User Already Exists , Login Instead",
      500
    );
    return next(error);
  }
  let savedUser;
  try {
    savedUser = await user.save();
  } catch (error) {
    const err = new HttpError("Couldnt Save This User" + error, 500);
    return next(err);
  }
  await sendWelcomeMail({ name: user.name, email: user.email });
  let token;

  try {
    token = jwt.sign(
      { userId: savedUser.id, email: savedUser.email },
      "GUARDTROL_SECRET_KEY"
    );

    // token = jwt.sign(
    //   { userId: savedUser.id, email: savedUser.email },
    //   "GUARDTROL_SECRET_KEY",
    //   { expiresIn: "48h" }
    // );

    res.status(201).json({
      token: token,
      userid: savedUser._id,
      email: savedUser.email,
      name: savedUser.name,
      clientid: savedUser.clientid,
      image: savedUser.image,
      emailverified: savedUser.emailverified,
      onboardingcomplete: savedUser.onboardingcomplete,
    });
  } catch (error) {
    const err = new HttpError("Signup Failed" + error, 500);
    return next(err);
  }
};

const SignIn = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("An Error Occured", 500);
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError("No User Exists For This Email Address", 401);
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
  } catch (error) {
    const err = new HttpError(
      "There Was An Error, Try Login In With Google",
      500
    );
    return next(err);
  }
  if (!isValidPassword) {
    const error = new HttpError("Incorrect Password", 401);
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "GUARDTROL_SECRET_KEY",
      { expiresIn: "10h" }
    );

    res.status(200).json({
      token: token,
      userid: existingUser._id,
      email: existingUser.email,
      emailverified: existingUser.emailverified,
      phone: existingUser.phone,
      address: existingUser.address,
      name: existingUser.name,
      clientid: existingUser.clientid,
      image: existingUser.image,
      emailverified: existingUser.emailverified,
      onboardingcomplete: existingUser.onboardingcomplete,
    });
  } catch (error) {
    const err = new HttpError("Signin Failed " + error, 500);
    return next(err);
  }
};

const GoogleSignIn = async (req, res, next) => {
  const { data } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: data.email });
  } catch (err) {
    const error = new HttpError("An Error Occured", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("No User Exists For This Email", 401);
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "GUARDTROL_SECRET_KEY",
      { expiresIn: "10h" }
    );

    res.status(200).json({
      token: token,
      userid: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      clientid: existingUser.clientid,
      image: existingUser.image,
      emailverified: existingUser.emailverified,
      onboardingcomplete: existingUser.onboardingcomplete,
    });
  } catch (error) {
    const err = new HttpError("Signin Failed " + error, 500);
    return next(err);
  }
};

const FinishOnboarding = async (req, res, next) => {
  const userid = req.params.userid;
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

  user.onboardingcomplete = true;
  await user.save();

  try {
    token = jwt.sign(
      { userId: user._id, email: user.email },
      "GUARDTROL_SECRET_KEY",
      { expiresIn: "48h" }
    );

    res.status(201).json({
      token: token,
      userid: user.id,
      email: user.email,
      name: user.name,
      clientid: user.clientid,
      image: user.image,
      onboardingcomplete: user.onboardingcomplete,
    });
  } catch (error) {
    const err = new HttpError("An Error Occured" + error, 500);
    return next(err);
  }
};

const getUser = async (req, res, next) => {
  const userid = req.params.userid;
  let user;
  try {
    user = await User.findById(userid)
      .populate({
        path: "subscriptions",
        model: Subscription,
      })
      .populate({
        path: "beats",
        model: BeatModel,
      })
      .populate({
        path: "guards",
        model: GuardModel,
      });
  } catch (error) {
    const err = new HttpError("Could Not Connect " + error, 401);
    return next(err);
  }
  if (!user) {
    const error = new HttpError("Invalid User", 401);
    return next(error);
  }

  res.status(200).json(user);
};

const updateUserImage = async (req, res, next) => {
  const client = req.params.client;
  let user;
  try {
    user = await User.findOne({ clientid: client });
    if (!user) {
      const error = new HttpError("Invalid User", 401);
      return next(error);
    }
    // console.log(user)
    // // Resize the image using sharp
    // console.log('resize image top')
    // const resizedImageBuffer = await sharp(req.file.buffer)
    //   .resize(200, 200)
    //   .toBuffer();
    //   console.log('resize image buttom')
    // // Save the resized image to the server with the same filename as the original uploaded file
    // const imagePath = `uploads/localhost_${Date.now()}_${req.file.originalname}`;
    // await fs.promises.writeFile(imagePath, resizedImageBuffer);

    // // Save the filename to the database
    user.image = `https://guardtrolapi.alphatrol.com/${req.file.path}`;
    await user.save();
    res.status(201).json(user);
    // Handle success or error
    // ...
  } catch (error) {
    const err = new HttpError("An Error Occured" + error, 500);
    return next(err);
  }
};

const updateUserEmail = async (req, res, next) => {
  const client = req.params.client;
  const { email, phone } = req.body;
  let user;
  try {
    user = await User.findOne({ clientid: client });
    if (!user) {
      const error = new HttpError("Invalid User", 401);
      return next(error);
    }
    user.email = email;
    user.phone = phone;
    await user.save();
    res.status(201).json(user);
    // Handle success or error
    // ...
  } catch (error) {
    const err = new HttpError("An Error Occured" + error, 500);
    return next(err);
  }
};

const updateUserPassword = async (req, res, next) => {
  const client = req.params.client;
  const { password, newpassword } = req.body;
  let user;
  try {
    user = await User.findOne({ clientid: client });
    if (!user) {
      const error = new HttpError("Invalid User", 401);
      return next(error);
    }

    let isValidPassword = false;

    if (null === user.password || !user.password) {
      isValidPassword = true;
    } else {
      try {
        isValidPassword = await bcrypt.compare(password, user.password);
      } catch (error) {
        const err = new HttpError("There Was An Error " + error, 500);
        return next(err);
      }
    }
    if (!isValidPassword) {
      const error = new HttpError("Incorrect Password", 401);
      return next(error);
    }
    let hashedPassword;

    try {
      hashedPassword = await bcrypt.hash(newpassword, 12);
    } catch (error) {
      const err = new HttpError(error, 500);
      return next(err);
    }

    user.password = hashedPassword;
    await user.save();
    res.status(201).json(user);
    // Handle success or error
    // ...
  } catch (error) {
    const err = new HttpError("An Error Occured" + error, 500);
    return next(err);
  }
};
const VerifyPayment = (paymentgateway, response) => {
  return new Promise((resolve, reject) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/transaction/verify/${response.reference}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve(JSON.parse(data));
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
};

const Subscribe = async (req, res, next) => {
  const userid = req.params.userid;
  const { plan, response, paymentgateway } = req.body;
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
    let newSubscription;
    if (paymentgateway === "paystack") {
      const res = await VerifyPayment(paymentgateway, response);
      console.log(res);
      if (res.data?.status !== "success") {
        const error = new HttpError("Payment Failed", 401);
        return next(error);
      }

      newSubscription = new Subscription({
        user: userid,
        plan: plan?.type,
        maxbeats: plan?.numberofbeats,
        maxextraguards: plan?.extraguards,
        totalamount: plan?.amount,
        paymentgateway: paymentgateway,
        transactionid: res?.data.id,
        expiresat:
          plan?.type === "yearly"
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentlog: res,
      });
    } else {
      newSubscription = new Subscription({
        user: userid,
        plan: plan?.type,
        maxbeats: plan?.numberofbeats,
        maxextraguards: plan?.extraguards,
        totalamount: response?.charged_amount,
        paymentgateway: paymentgateway,
        transactionid: response?.transaction_id,
        expiresat:
          plan?.type === "yearly"
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentlog: response,
      });
    }

    await newSubscription.save();

    user.subscriptions = [...user.subscriptions, newSubscription];

    await user.save();

    await mailer.sendSubscriptionMail({
      name: user.name,
      subject: "Guardtrol Subscription",
      email: user.email,
      plan: plan?.type,
      date: newSubscription.createdat.toLocaleDateString(),
      title: "Subscription Successful",
      beats: newSubscription.maxbeats,
      amount: `₦${formatNumberWithCommas(plan?.amount)}`,
    });

    res.status(201).json({
      message: "subscribed",
      subscription: newSubscription,
    });
  } catch (err) {
    const error = new HttpError(`Subscription failed: ${err}`, 401);
    return next(error);
  }
};

const getCurrentSubscription = async (userId) => {
  try {
    // Populate user's subscriptions
    const userSubscriptions = await Subscription.find({ user: userId });

    // Find the current subscription which has not expired yet
    const currentDate = new Date();
    const currentSubscription = userSubscriptions.find(
      (subscription) => currentDate < subscription.expiresat
    );

    return currentSubscription;
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    throw error; // Forward the error to the caller
  }
};

const getUserSubscription = async (req, res, next) => {
  const userid = req?.userData?.userId;

  let user;
  try {
    user = await User.findById(userid);
  } catch (error) {
    const err = new HttpError("Could Not Get Subscriptions " + error, 401);
    return next(err);
  }

  getCurrentSubscription(userid)
    .then((currentSubscription) => {
      if (currentSubscription) {
        res.status(200).json({
          status: true,
          subscription: currentSubscription,
        });
      } else {
        res.status(200).json({
          status: false,
        });
      }
    })
    .catch((error) => {
      const err = new HttpError("Could Not Get Subscriptions " + error, 401);
      return next(err);
    });
};

const getAllSubscription = async (req, res, next) => {
  const userid = req?.userData?.userId;

  let user;
  try {
    user = await User.findById(userid);
  } catch (error) {
    const err = new HttpError("Could Not Get Subscriptions " + error, 401);
    return next(err);
  }

  const userSubscriptions = await Subscription.find({ user: userid });

  res.status(200).json({
    status: true,
    subscriptions: userSubscriptions,
  });
};

const verifyEmail = async (req, res, next) => {
  const userid = req.params.userid;
  const { code } = req.body;
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

  if (code != user.temporarycode) {
    const error = new HttpError("invalid code provided", 401);
    return next(error);
  }
  user.temporarycode = null;
  user.emailverified = true;
  await user.save();
  await sendNotificationMail({
    email: user.email,
    name: user.name,
    header: "Account Verification Successful!",
    subject: "Your Email has been verified",
    message1: `Congratulation! Your account is now active and you can login to your account.`,
    title: "Account Verification Successful",
  });
  res.status(201).json({ message: "Email Verification Successful" });
};
const generate6DigitCode = () => {
  return Math.floor(Math.random() * 900000) + 100000;
};
const checkVerifyEmail = async (req, res, next) => {
  const userid = req.params.userid;
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
  if (!user.emailverified) {
    const code = generate6DigitCode();
    user.temporarycode = code;
    await user.save();
    await sendVerificationMail({
      email: user.email,
      code: user.temporarycode,
      name: user.name,
    });
  }
  res.status(201).json({ isverified: user.emailverified });
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  let user;
  try {
    user = await User.findOne({ email: email });
    if (!user) {
      const error = new HttpError(
        "No User Found For The Provided Email Address",
        401
      );
      return next(error);
    }

    let resetToken;
    // Generate reset token
    resetToken = crypto.randomBytes(20).toString("hex");

    // Set token expiration time (e.g., 1 hour from now)
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour in milliseconds

    // Save reset token and expiration time to user document in the database
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    // Send email with reset link containing reset token
    // This step is typically handled using a library like nodemailer

    await sendPasswordResetLink({
      email: user.email,
      name: user.name,
      token: user.resetToken,
    });

    res
      .status(200)
      .json({ message: "Reset Token Generated. Check Your Email." });
  } catch (error) {
    const err = new HttpError(error, 401);
    return next(err);
  }
};

const resetPassword = async (req, res, next) => {
  const { resetToken, password } = req.body;
  let user;
  try {
    // Find user by reset token
    user = await User.findOne({ resetToken: resetToken });

    if (!user) {
      const error = new HttpError("Invalid Or Expired Reset Link", 400);
      return next(error);
    }

    // Check if reset token has expired
    if (user.resetTokenExpiration < Date.now()) {
      const error = new HttpError(
        "This Reset Link Has Expired Request a New One",
        400
      );
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Reset password
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();
    await sendNotificationMail({
      email: user.email,
      name: user.name,
      header: "Password Reset Successful!",
      subject: "Your Account Password has been Changed",
      message1:
        "You have successfully created a new password for your Guardtrol Account",
      message2: `If you did not request this action please contact us immediately`,
      title: "Account Password Changed",
    });

    res.status(200).json({ message: "Password Reset Successful" });
  } catch (err) {
    const error = new HttpError(err, 401);
    return next(error);
  }
};

exports.SignUp = SignUp;
exports.getUser = getUser;
exports.SignIn = SignIn;
exports.GoogleSignUp = GoogleSignUp;
exports.GoogleSignIn = GoogleSignIn;
exports.updateUserImage = updateUserImage;
exports.updateUserEmail = updateUserEmail;
exports.updateUserPassword = updateUserPassword;
exports.verifyEmail = verifyEmail;
exports.checkVerifyEmail = checkVerifyEmail;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;

exports.getUserSubscription = getUserSubscription;
exports.Subscribe = Subscribe;

exports.FinishOnboarding = FinishOnboarding;
exports.getAllSubscription = getAllSubscription;
