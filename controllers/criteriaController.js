const { criteria } = require("../models");
const db = require("../models");

const Criteria = db.criteria;
const User = db.user;
const Event = db.event;
const CriteriaLevel = db.criteriaLevel;

exports.createCriteria = async (req,res,next)=>{
    try{

        CriteriaLevel.find({
            criteriaField: req.body.criteriaField
        },{"_id": 1}).exec((err,levels) => {
            if(err){
                res.status(500).send({message: err});
                return;
            }

            const newCriteria = Criteria({
                criteriaField: req.body.criteriaField,
                description: req.body.description,
                category : req.body.category,
                levels: req.body.levels ? req.body.levels : levels.map(level => level),
            })
            newCriteria.save((err,newCriteria)=>{
                if(err){
                    res.status(500).send({message: err});
                    return;
                }
                if(req.body.events){
                    Event.find({
                        _id: {$in: req.body.events}
                    },
                    (err, events)=>{
                        if(err){
                            res.status(500).send({ message: err });
                            return;
                        }

                        newCriteria.events = events.map(event => event._id);
                        newCriteria.save(err=>{
                            if(err){
                                res.status(500).send({ message: err });
                            return;
                            }
                            res.send({message:"Criteria was created succesfully okay!",newCriteria});
                        });
                    })
                }else{
                    newCriteria.events = [];
                    newCriteria.save(err=>{
                        if(err){
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.send({message:"Criteria was created successfully!"});
                    });
                }
        })
        });

        



        // const newCriteria = new Criteria ({
        //     criteriaField: req.body.criteriaField,
        //     events: req.body.events,
        // });
        // newCriteria.save((err,newCriteria)=>{
        //     if(err){
        //         res.status(500).send({message: err});
        //         return;
        //     }
        //     if(req.body.events){
        //         Event.find({
        //             _id: {$in: req.body.events}
        //         },
        //         (err, events)=>{
        //             if(err){
        //                 res.status(500).send({ message: err });
        //                 return;
        //             }

        //             newCriteria.events = events.map(event => event._id);
        //             newCriteria.save(err=>{
        //                 if(err){
        //                     res.status(500).send({ message: err });
        //     return;
        //                 }
        //                 res.send({message:"Criteria was created succesfully!"});
        //             });
        //         })
        //     }else{
        //         newCriteria.events = [];
        //         newCriteria.save(err=>{
        //             if(err){
        //                 res.status(500).send({ message: err });
        //     return;
        //             }

        //             res.send({message:"Criteria was created successfully!"});
        //         });
        //     }
        // })
    }catch(error){
        if (error.code === 11000) 
            return res.status(200).send({ message: "Criteria already exist" });
        return res.status(400).send({ message: "unable to create event", error });
    }
};

exports.getCriterion = async (req,res,next)=>{
    await Criteria.find().populate('levels')
    .exec((err,criteria)=>{
        if(err){
            return res.status(400).send("an error occurred", err);
        }

        res.send(criteria)
    })
}

exports.showByCategory = async (req,res,next)=>{
    const {category} =req.query;
    await Criteria.find({
        category: category
    })
    .populate('events levels')
    .exec((err,criterion) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send(criterion);
    })
}

exports.getByFieldAndEvent = async (req,res,next)=>{
    const {id} =req.query;

    await Criteria.find({
        _id: id
        // criteriaField: { $in: req.body.criteriaField,}
    })
    .populate('events levels')
    .exec((err,criteria) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send(criteria[0]);
    })
}