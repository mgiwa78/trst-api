const { Timestamp } = require("mongodb");
const { default: mongoose } = require("mongoose");

const invoiceSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
  description: { type: String },
  transactionid: { type: String },
  trxref: { type: String },
});

invoiceSchema.set("timestamps", true);

invoiceSchema.index({ expiresat: 1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
