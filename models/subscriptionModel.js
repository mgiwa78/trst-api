const { default: mongoose } = require("mongoose");

const subscriptionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  plan: { type: String },
  maxbeats: { type: Number, required: true, default: 0 },
  maxextraguards: { type: Number, default: 0 },
  totalamount: { type: Number, required: true },
  paymentstatus: {
    type: String,
    enum: ["pending", "complete"],
    default: "complete",
  },
  paymentgateway: { type: String, enum: ["flutterwave", "paystack"] },
  transactionid: { type: String },
  createdat: { type: Date, default: Date.now() },
  updatedat: { type: Date, default: Date.now() },
  expiresat: { type: Date, required: true },
  paymentlog: {},
});
subscriptionSchema.set("timestamps", true);

subscriptionSchema.index({ expiresat: 1 });

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;
