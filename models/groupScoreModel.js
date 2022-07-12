const mongoose = require("mongoose");
const GroupScore = mongoose.model(
  "GroupScore",
  new mongoose.Schema({
    score: Number,
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },
    examiner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    criteria:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Criteria"
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    },
})
);
module.exports = GroupScore;