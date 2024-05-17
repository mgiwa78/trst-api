const { default: mongoose } = require("mongoose");

const pointSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true, default: "" },
  imageUrl: { type: String, required: true, default: "" },
  coordinates: { type: String, required: true, default: 0 },
});
pointSchema.set("timestamps", true);

pointSchema.index({ expiresat: 1 });

const Point = mongoose.model("Point", pointSchema);
module.exports = Point;
