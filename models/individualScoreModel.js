const mongoose = require("mongoose");
const IndividualScore = mongoose.model(
  "IndividualScore",
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
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate"
    },
})
);
module.exports = IndividualScore;