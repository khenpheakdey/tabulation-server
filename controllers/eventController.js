const { TokenExpiredError } = require("jsonwebtoken");
const { user } = require("../models");
const db = require("../models");

const Event = db.event;
const User = db.user;
const Criteria = db.criteria;

exports.createEvent = async (req,res,next)=>{
    try{
        const newEvent = new Event ({
            title: req.body.title,
            eventDate: req.body.eventDate,  
            eventStatus: req.body.eventStatus,
            active: true,
        });

        newEvent.save((err,newEvent) =>{
            if(err){
                res.status(500).send({message: err});
                return;
            }

            if(req.body.examiners){
                User.find({
                    _id: { $in: req.body.examiners }
                },
                (err, examiners)=>{
                    if(err){
                        res.status(500).send({ message: err });
                        return;
                    }

                    newEvent.examiners = examiners.map(examiner => examiner._id);

                    newEvent.save(err => {
                        if(err){
                            console.log(err);
                            res.status(500).send({ message: err });
                            return;
                        }

                        if(req.body.groupCriterion){
                            Criteria.find({
                                _id: {$in : req.body.groupCriterion},
                                category: "group"
                            },(err,groupCriterion)=>{
                                if(err){
                                    console.log(err);
                                    res.status(500).send({ message: err });
                                    return;
                                }

                                newEvent.groupCriterion = groupCriterion.map(criteria => criteria._id);
                                newEvent.save(err => {
                                    if(err){
                                        console.log(err);
                                        res.status(500).send({ message: err });
                                        return;
                                    }

                                    if(req.body.individualCriterion){
                                        Criteria.find({
                                            _id: {$in : req.body.individualCriterion},
                                            category: "individual"
                                        },(err,individualCriterion)=>{
                                            if(err){
                                                console.log(err);
                                                res.status(500).send({ message: err });
                                                return;
                                            }

                                            newEvent.individualCriterion = individualCriterion.map(criteria => criteria._id);
                                            newEvent.save(err => {
                                                if(err){
                                                    console.log(err);
                                                    res.status(500).send({ message: err });
                                                    return;
                                                }

                                                res.send({message:"Event was created successfully!"});
                                            });
                                        })
                                    }
                                });
                            })
                        }
                    });
                });


                
            }else{
                newEvent.events = [];
                newEvent.criterion = [];
                newEvent.save(err=>{
                    if(err){
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.send({message:"Event was created successfully!"});
                });
            }
           
        });
    }catch(error){
        if (error.code === 11000) 
            return res.status(200).send({ message: "event already exist" });
        return res.status(400).send({ message: "unable to create event", error });
    }
};

exports.upcomingEvent= async (req,res,next)=>{
    await Event.aggregate([
        {
            $sort: {eventDate: 1}
        },{
            $limit: 3
        }
    ]).exec((err,events)=>{
        if (err) return handleError(err);
        res.send(events)
    })
}

exports.getById = async (req,res,next)=>{
    const { id } = req.query;
    console.log(id);

    await Event.findById(id)
    .populate('examiners groupCriterion individualCriterion')
    .exec((err, event) => {
        if (err) return handleError(err);

        Criteria.populate(event,{
            path: 'groupCriterion.levels',
        }, (err,event)=>{
            if (err) return handleError(err);
            Criteria.populate(event,{
                path: 'individualCriterion.levels',
            },((err,event)=>{
            if (err) return handleError(err);
            return res.send(event);
            }
            ))
        })
    })
}


exports.getEvents = async (req,res,next)=>{
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const myCustomLabels = {
        totalDocs: 'totalItems',
        docs: 'data',
        limit: 'pageSize',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'totalPages',
        pagingCounter: 'slNo',
        meta: 'paginator'
        };
    
    Event.paginate({

    },{
        populate: ["examiners","groupCriterion","individualCriterion"],
        offset, 
        limit, 
        customLabels: myCustomLabels})
        .then(result=>{
        res.send(result);
    }).catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
    // .then( data => {
    //     res.send(data)
    // })
    // .catch(err => {
    //     return res.status(400).send("an error occurred", err);
    // });
};

// exports.updateById = async (req,res,next) => {
//     console.log(req.params['eventId']);
// };

exports.update = async (req,res,next) => {
    if (!req.body) {
        return res.status(400).send({
        message: "Data to update can not be empty!"
        });
    }
    const id = req.query['id'];
    console.log(id);

    Event.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Event with id=${id}. Maybe Event was not found!`
        });
      } else res.send({ message: "Event was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Event with id=" + id
      });
    });
};

exports.delete = async (req,res,next) => {
    const id = req.query['id'];
    console.log(id);

    Event.findOneAndDelete({_id: id})
    .then(data => {
        return res.send({message:"Event succesfully deleted!", data: data});
    })
    .catch(err => {
      res.status(500).send({
        message: "Error deleting Event with id=" + id
      });
    });
}

exports.getNumberOfEvents = async (req,res,next)=>{
    try{
        await Event.find()
        .populate([{
            path: 'examiners',
            select: 'username _id',
        },{
            path: 'groupCriterion',
        },{
            path: "individualCriterion",
        }])
        .exec( (err, event) => {
            if (err) return handleError(err);

           return res.status(200).send({data:event,allEvents:event.length});
        })
    
    }catch(error){
        return res.status(400).send({ message: "unable to get event", error });
    }
};

exports.getEventByExaminer = async (req,res,next)=>{
    const { examiner } = req.query;

    console.log(examiner);

    try {
        await Event.find({
            examiners: {$eq: examiner},
        }).populate("examiners groupCriterion individualCriterion").exec((err,events)=>{
            if (err) return handleError(err);

            return res.send(events)
        })
    } catch (error) {
        return res.status(400).send({ message: "unable to get event", error });
    }

}

const getPagination = (page,size)=> {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
}

