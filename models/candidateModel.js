const mongoose = require("mongoose");
const Candidate = mongoose.model(
  "Candidate",
  new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    gender: {
        type: String,
        enum: [ "male" , "female" , "none" ],
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
      }
    ],
    active: {
        type: Boolean,
        default: true,
    },
  })
);
module.exports = Candidate;