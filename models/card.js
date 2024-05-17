const { v4: uuidv4 } = require("uuid");
const { default: mongoose } = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const cardSchema = mongoose.Schema({
  number: { required: true, type: String },
  csv: { type: Number, default: null },
  expDate: { type: String },
  nameOnCard: { type: String },
  owner: { type: String },
});

cardSchema.set("timestamps", true);

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
