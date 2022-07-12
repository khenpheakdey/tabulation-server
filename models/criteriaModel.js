const mongoose = require("mongoose");
const Criteria = mongoose.model(
  "Criteria",
  new mongoose.Schema({
    criteriaField: String,
    description: String,
    category: {
      type: String,
      enum:[ "group" , "individual" ]
    },
    levels:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CriteriaLevel"
      }
    ],
    events:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
      }
    ]
  })
);
module.exports = Criteria;