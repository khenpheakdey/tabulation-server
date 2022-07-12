const { restart } = require("nodemon");
const { user } = require("../models");
const db = require("../models");

const Candidate = db.candidate;
const Event = db.event;
const Criteria = db.criteria;
const User = db.user;


exports.create = async (req,res,next)=>{
    try {
        const newCandidate = new Candidate ({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,  
            gender: req.body.gender,
            events: req.body.events,
            active: true
        });

    newCandidate.save((err,newCandidate) => {
        if(err){
            res.status(500).send({message: err});
            return;
        }
        if(req.body.events){
            Event.find({
                _id: { $in: req.body.events }
            },
            (err, events) => {
                console.log(events);
                if(err){
                    res.status(500).send({ message: err });
                    return;
                }

                newCandidate.events = events.map(event => event._id);
                newCandidate.save(err=>{
                    if(err){
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.send({message:"Criteria was created succesfully okay!",newCandidate});
                });
            })
        }else{
            newCandidate.events = [];
            newCandidate.save(err=>{
                if(err){
                    res.status(500).send({ message: err });
                    return;
                }

                res.send({message:"Criteria was created successfully!"});
            });
        }
    });
    } catch (error) {
        if (error.code === 11000) 
            return res.status(200).send({ message: "Candidate already exist" });
        return res.status(400).send({ message: "unable to create Candidate", error });
    }
};


exports.get = async (req,res,next) => {
    await Candidate.find()
    .populate('events').exec((err,candidates)=>{
        if(err){
            res.status(500).send({message: err});
            return;
        }

        return res.status(200).send(candidates);
    })
}

exports.update = async (req,res,next) => {
    if (!req.body) {
        return res.status(400).send({
        message: "Data to update can not be empty!"
        });
    }
    const id = req.query['id'];
    console.log(id);

    Candidate.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
    if (!data) {
        res.status(404).send({
            message: `Cannot update Candidate with id=${id}. Maybe Candidate was not found!`
        });
    } else res.send({ message: "Candidate was updated successfully." });
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Candidate with id=" + id
        });
    });
};


exports.delete = async (req,res,next) => {
    const id = req.query['id'];
    console.log(id);

    Candidate.findOneAndDelete({_id: id})
    .then(data => {
        return res.send({message:"Candidate succesfully deleted!", data: data});
    })
    .catch(err => {
      res.status(500).send({
        message: "Error deleting Event with id=" + id
      });
    });
}

exports.showOne = async (req,res,next) => {
    const { id } = req.query;

    await Candidate.findById(id)
    .populate('events')
    .exec((err, Candidate) => {
        if (err) return handleError(err);

        Criteria.populate(Candidate,{
            path: 'events.criterion',
        }, (err,Candidate)=>{
            if (err) return handleError(err);

            User.populate(Candidate,{
                path: 'events.examiners',
                select: 'username _id'
            },(err,Candidate)=>{
                if (err) return handleError(err);

                return res.send(Candidate);
            })
            
        })
        

    })
}

exports.getByEvent = async (req,res,next) => {
    const { event_id } = req.query
    console.log(event_id);
    await Candidate.find({
        events:  {$in : event_id}
    }).exec((err,candidate)=>{
        if (err) return handleError(err);
        console.log(candidate);
        return res.send(candidate)
    })
}