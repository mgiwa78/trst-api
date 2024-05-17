const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");

const patrolSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true, default: "" },
  time: { type: String, required: true, default: "" },
  points: [{ type: ObjectId, ref: "Point" }],
});
patrolSchema.set("timestamps", true);

patrolSchema.index({ expiresat: 1 });

const Patrol = mongoose.model("Patrol", patrolSchema);
module.exports = Patrol;
