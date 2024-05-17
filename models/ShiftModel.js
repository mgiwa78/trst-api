const { Timestamp } = require("mongodb");
const { default: mongoose } = require("mongoose");

const shiftSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String },
  start: { type: String },
  end: { type: String },
});

shiftSchema.set("timestamps", true);

shiftSchema.index({ expiresat: 1 });

const Shift = mongoose.model("Shift", shiftSchema);
module.exports = Shift;
