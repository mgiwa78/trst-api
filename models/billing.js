const { v4: uuidv4 } = require("uuid");
const { default: mongoose } = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const billingSchema = mongoose.Schema({});

billingSchema.set("timestamps", true);

const Billing = mongoose.model("Billing", cardSchema);
module.exports = Billing;
