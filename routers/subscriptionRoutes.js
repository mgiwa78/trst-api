const express = require("express");

const SubscriptionController = require("../controllers/subscriptionController");
const Auth = require("../middleware/auth");
const subscriptionRouter = express.Router();
subscriptionRouter.use(Auth);

subscriptionRouter.post("/", SubscriptionController.createSubscription);
subscriptionRouter.patch("/", SubscriptionController.updateSubscription);
subscriptionRouter.get("/", SubscriptionController.getSubscriptionsForUser);

subscriptionRouter.get(
  "/user/active",
  SubscriptionController.getCurrentSubscriptionForUser
);

module.exports = subscriptionRouter;
