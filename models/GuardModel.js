const { default: mongoose } = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const GuardSchema = mongoose.Schema({
  name: { required: true, type: String },
  phone: { required: true, type: Number },
  isactive: { type: Boolean, enum: [true, false], default: false },
  status: { type: String, default: "off duty" },
  profileImage: {
    type: String,
    default: "uploads/guards/profiles/guard.png",
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  beat: { type: mongoose.Schema.Types.ObjectId, ref: "Beat" },
  comment: mongoose.Schema.Types.Mixed,
  personalinformation: mongoose.Schema.Types.Mixed,
  identification: mongoose.Schema.Types.Mixed,
  nextofkin: mongoose.Schema.Types.Mixed,
  banking: mongoose.Schema.Types.Mixed,
  guarantor: mongoose.Schema.Types.Mixed,
});

GuardSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model("Guard", GuardSchema);
