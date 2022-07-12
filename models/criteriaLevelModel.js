const mongoose = require("mongoose");
const Criteria = mongoose.model(
  "CriteriaLevel",
  new mongoose.Schema({
    criteriaField: String,
    description: String,
    levels: {
      type: String,
      enum:[ "Excellent" , "Very good","Satisfactory","Unsatisfactory" ]
    },
    minScore: Number,
    maxScore: Number,
  })
);
module.exports = Criteria;