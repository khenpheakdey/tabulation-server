const mongoose = require("mongoose");
const Group = mongoose.model(
  "Group",
  new mongoose.Schema({
    groupName: String,
    events: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
        }
    ],
    candidates: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate"
        }
    ],
  })
);
module.exports = Group;