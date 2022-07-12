const db = require("../models");

const Event = db.event;
const CriteriaLevel = db.criteriaLevel;


exports.create = async (req,res,next) => {
    await CriteriaLevel.insertMany(req.body,(err,docs)=>{
        res.status(200).send(docs);
    })
};

exports.showAllCriteria = async (req,res,next) => {
    try {
        console.log("first")
        CriteriaLevel.aggregate(
            [
                {$group : { _id : "$criteriaField" } }
            ]
        ).exec((err,data)=>{
            res.send(data);
        })

    } catch (error) {
        // res.send(err)
    }
}