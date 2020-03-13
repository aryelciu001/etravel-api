const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  profile: {
    type: Schema.Types.ObjectId,
    ref: "Story"
  },
  profilingTest: {
    type: Schema.Types.ObjectId,
    ref: "ProfilingTest"
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
