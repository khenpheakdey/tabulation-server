const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Event = mongoose.model(
  "Event",
  new mongoose.Schema({
    title: String,
    eventDate: Date,
    eventStatus: String,
    groupCriterion:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Criteria"
      }
    ],
    individualCriterion:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Criteria"
      }
    ],
    active: {
        type: Boolean,
        default: true,
    },
    examiners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
  },
  mongoose.plugin(mongoosePaginate))
);



module.exports = Event;