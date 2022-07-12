const { user } = require("../models");
const db = require("../models");

const { Parser } = require('json2csv');

const IndividualScore = db.individualScore;
const User = db.user;
const Candidate = db.candidate;
const Criteria = db.criteria;
const Event = db.criteria;


exports.createScore = async (req,res,next)=>{
    try{
        const newScore = new IndividualScore ({
            score: req.body.score,
            event: req.body.event,
            examiner: req.body.examiner,
            criteria: req.body.criteria,
            candidate: req.body.candidate,
        });
        Candidate.findOne({ _id: req.body.candidate},(err,candidate)=>{
            if(err){
                res.status(500).send({ message: err });
                return;
            }
            
            newScore.candidate = candidate._id;
        });
        Event.findOne({ _id: req.body.event}, (err,event) => {
            if(err){
                res.status(500).send({ message: err });
                return;
            }
        });
        Criteria.findOne({ _id: req.body.criteria, category: "individual"},(err,criteria)=>{
            if(err){
                res.status(500).send({ message: err });
                return;
            }
            newScore.criteria = criteria._id;
        });
        User.findOne({ _id: req.body.examiner},(err,examiner)=>{
            if(err){
                res.status(500).send({ message: err });
                return;
            }
            newScore.examiner = examiner._id;
        });
        newScore.save((err,newScore)=>{
            if(err){
                res.status(500).send({message: err});
                return;
            }

            return res.status(200).send({message:"Score was created successfully!",data:newScore});
        })
    }catch(error){
        return res.status(400).send({ message: "unable to create event", error });
    }
};

exports.createScores = async (req,res,next)=>{
    await IndividualScore.insertMany(req.body,(err,docs)=>{
        res.status(200).send(docs);
    })
}

exports.getScore = async (req,res,next)=>{ 
    const {event,candidate} = req.query;
    try {
        IndividualScore.find(
            {
                event: event,
                // candidate: candidate
            }).select("_id score criteria event candidate").populate({
                path: "criteria event candidate",
                select: "-_id criteriaField title firstName lastName"
            }).exec(
            (err, docs) => {
                if (err){
                    res.status(500).send({message: err});
                    return;
                }
                return res.status(200).send(docs);
            });
    } catch (error) {
        return res.status(400).send({ message: "an error occured", error });
    }
}
