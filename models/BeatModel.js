const { default: mongoose } = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const BeatSchema = mongoose.Schema({
    name: { required: true, type: String },
    address: {type: String, default: ""},
    description: {required: true, type: String},
    isactive: {type: Boolean, enum: [true, false], default: false},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guards: [{type: mongoose.Schema.Types.ObjectId, ref: 'Guard'}]
});

BeatSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('Beat', BeatSchema);
