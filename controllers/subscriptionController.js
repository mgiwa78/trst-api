const Subscription = require("../models/subscriptionModel");
const User = require("../models/user-model");
const Invoice = require("../models/InvoiceModel");
const mailer = require("../Emails/EmailController");
const { formatNumberWithCommas } = require("../Utils/Functions");

// Function to create a new subscription
const createSubscription = async (req, res, next) => {
  const userid = req?.userData?.userId;
  const {
    maxbeats,
    maxextraguards,
    totalamount,
    plan,
    paymentgateway,
    expiresat,
    transactionid,
    transaction,
    trxref,
  } = req.body;
  try {
    const subscription = new Subscription({
      user: userid,
      maxbeats,
      maxextraguards,
      totalamount,
      plan,
      expiresat,
      paymentgateway,
      paymentStatus: "complete",
    });

    await subscription.save();
    const invoice = new Invoice({
      user: userid,
      subscription: subscription._id,
      description: "New subscription",
      user: userid,
      transactionid: transactionid || transaction,
      trxref,
    });

    invoice.save();
    const userData = await User.findById(userid);

    await mailer.sendSubscriptionMail({
      name: userData.name,
      subject: "Guardtrol Subscription Update",
      email: userData.email,
      plan: plan ? plan : "",
      date: subscription.createdat.toLocaleDateString(),
      title: "Subscription Update Successful",
      beats: subscription.maxbeats,
      amount: `₦${formatNumberWithCommas(totalamount)}`,
    });

    res.status(200).json(subscription);
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

const updateSubscription = async (req, res, next) => {
  const userid = req?.userData?.userId;
  const {
    _id: subscriptionId,
    maxbeats,
    maxextraguards,
    totalamount,
    plan,
    paymentgateway,
    transactionid,
    trxref,
    expiresat,
  } = req.body;
  try {
    await Subscription.findByIdAndUpdate(subscriptionId, {
      user: userid,
      maxbeats,
      maxextraguards,
      totalamount,
      plan,
      expiresat,
      paymentgateway,
      paymentStatus: "complete",
    });

    const subscription = await Subscription.findById(subscriptionId);
    const userData = await User.findById(userid);

    const invoice = new Invoice({
      user: userid,
      subscription: subscription._id,
      description: "Subscription update",
      transactionid,
      trxref,
    });

    invoice.save();

    await mailer.sendSubcriptionUpdateMail({
      name: userData.name,
      subject: "Subscription Updated",
      email: userData.email,
      plan,
      date: subscription.createdat.toLocaleDateString(),
      title: "Subscription Update Successful",
      beats: subscription.maxbeats,
      maxextraguards: subscription.maxextraguards,
      amount: `₦${formatNumberWithCommas(totalamount)}`,
    });

    res.status(200).json(subscription);
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

const getSubscriptionsForUser = async (req, res, next) => {
  // Function to retrieve subscriptions for a user

  try {
    const userid = req?.userData?.userId;
    const subscriptions = await Subscription.find({ user: userid });
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    throw error;
  }
};

const getCurrentSubscriptionForUser = async (req, res, next) => {
  const userid = req?.userData?.userId;

  try {
    const now = new Date(); // Get the current date and time
    const subscriptions = await Subscription.find({
      user: userid,
      expiresat: { $gt: now }, // Filter subscriptions that have not expired
    })
      .sort({ expiresat: 1 }) // Sort by expiration date in descending order
      .limit(1); // Limit to the most recent subscription

    if (subscriptions.length > 0) {
      console.log(subscriptions);
      return res.status(200).json(subscriptions[0]); // Return the most recent active subscription
    } else {
      return res.status(200).json(null); // Return null if no active subscription is found
    }
  } catch (error) {
    console.error("Error fetching subscription:", error);
    throw error;
  }
};
module.exports = {
  createSubscription,
  getCurrentSubscriptionForUser,
  getSubscriptionsForUser,
  updateSubscription,
};
