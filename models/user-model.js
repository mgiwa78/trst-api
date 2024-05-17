const { v4: uuidv4 } = require("uuid");
const { default: mongoose, model } = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const generate6DigitCode = () => {
  return Math.floor(Math.random() * 900000) + 100000;
};

const userSchema = mongoose.Schema({
  name: { required: true, type: String },
  email: { unique: true, required: true, type: String },
  address: { required: true, type: String },
  emailverified: {
    type: Boolean,
    required: true,
    default: false,
    enum: [true, false],
  },
  temporarycode: { type: Number, default: null }, //6 digit number between 1000
  password: { type: String },
  phone: { type: Number, required: false },
  image: { type: String, required: false, default: "uploads/images/user.svg" },
  resetToken: { type: String, default: null }, // Reset token for password reset
  resetTokenExpiration: { type: Date, default: null },
  clientid: { type: String, required: true, default: uuidv4() }, // Comma was added here
  onboardingcomplete: { type: Boolean, enum: [true, false], default: false },
  subscriptions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
  ], // i think this should be an array
  beats: [{ type: mongoose.Schema.Types.ObjectId, ref: "beat" }],
  guards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Guard" }],
});

userSchema.set("timestamps", true);

const User = mongoose.model("User", userSchema);
module.exports = User;
