// User model in mongoose

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  profile: {
    type: Schema.Types.ObjectId,
    ref: "Profile"
  },
  profilingResult: {
    type: Schema.Types.ObjectId,
    ref: "ProfilingResult"
  },
  history: [
    {
      type: Schema.Types.ObjectId,
      ref: "TravelPlan"
    }
  ]
});

const User = mongoose.model("User", userSchema);
module.exports = User;
