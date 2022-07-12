const db = require("../models");

const Group = db.group;
const Event = db.event;
const Candidate = db.candidate;
const User = db.user;

exports.createGroup = async (req,res,next)=>{
    try {
        const newGroup = new Group ({
            groupName: req.body.groupName,
        });
        newGroup.save((err,newGroup)=>{
            if(err){
                res.status(500).send({message: err});
                return;
            }

            if(req.body.candidates){
                Candidate.find({
                    _id: {$in: req.body.candidates}
                }).populate("events").exec((err,candidates)=>{
                    if(err){
                        res.status(500).send({ message: err });
                        return;
                    }
                newGroup.candidates = candidates.map(candidate => candidate._id);
                newGroup.save(err => {
                    if(err){
                        console.log(err);
                        res.status(500).send({ message: err });
                        return;
                    }
                    Event.find({
                        _id: {$in: req.body.events}
                    }).exec((err,events)=>{
                        if(err){
                            res.status(500).send({ message: err });
                            return;
                        }
                        newGroup.events = events.map(event => event._id);
                        newGroup.save(err => {
                        if(err){
                            console.log(err);
                            res.status(500).send({ message: err });
                            return;
                        }
                        res.send({message:"Group was created successfully!"});
                    })
                    })
                })
                })
            }else{
                newGroup.candidates = [];
                newGroup.save(err => {
                    if(err){
                        console.log(err);
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.send({message:"Group was created successfully!"});
                })
            }
        })
    } catch (error) {
        if (error.code === 11000) 
            return res.status(200).send({ message: "Group already exist" });
        return res.status(400).send({ message: "unable to create Group", error });
    }
}


exports.getByEvent = async (req,res,next)=>{
    const {event} = req.query;

    await Group.find({
        event: event
    }).populate("candidates").exec(
    (err, docs) => {
        if (err){
            res.status(500).send({message: err});
            return;
        }
        return res.status(200).send(docs);
    });
}