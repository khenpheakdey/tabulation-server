const { user } = require("../models");
const db = require("../models");

const { Parser } = require('json2csv');

const GroupScore = db.groupScore;
const User = db.user;
const Group = db.group;
const Criteria = db.criteria;
const Event = db.criteria;


exports.createScore = async (req,res,next)=>{
    try{
        const newScore = new GroupScore ({
            score: req.body.score,
            event: req.body.event,
            examiner: req.body.examiner,
            criteria: req.body.criteria,
            group: req.body.group,
        });
        Group.findOne({ _id: req.body.group},(err,group)=>{
            if(err){
                res.status(500).send({ message: err });
                return;
            }
            
            newScore.group = group._id;
        });
        Event.findOne({ _id: req.body.event}, (err,event) => {
            if(err){
                res.status(500).send({ message: err });
                return;
            }
        });
        Criteria.findOne({ _id: req.body.criteria, category: "group"},(err,criteria)=>{
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
    await GroupScore.insertMany(req.body,(err,docs)=>{
        res.status(200).send(docs);
    })
}

exports.getScore = async (req,res,next)=>{ 
    const {event,group} = req.query;
    try {
        GroupScore.find(
            {
                event: event,
                // group: group
            }).select("_id score criteria event group").populate({
                path: "criteria event group",
                select: "-_id criteriaField title groupName"
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

exports.getLatest = async (req,res,next)=>{
    const {id} = req.query;
    await GroupScore
        .aggregate([{
            $match: {group: id}
        },
        {
            $sort: {_id: -1}
        },{
            $limit: 3
        }]).exec(
        (err, docs) => {
            if (err){
                res.status(500).send({message: err});
                return;
            }
            return res.status(200).send(docs);
        });

}

