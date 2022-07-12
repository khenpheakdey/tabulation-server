const { user } = require("../models");
const db = require("../models");

const User = db.user;
const Role = db.role;

exports.getExaminers = async(req,res,next) => {
  try {
    User.find({
      roles: {
        $eq: "62c6cc7f201b0c1b8c102658"
      }
    })
    .exec(
      (err,examiners)=>{
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send(examiners);
      }
    )

  } catch (error) {
    res.send(error)
  }
}

exports.getOneExaminer  = async (req,res,next) => {
  const { id } = req.query;
    console.log(id);

    await User.findById(id)
    .populate({
      path:'roles',
      select: "-__v"
    })
    .exec((err, event) => {
        if (err) return handleError(err);
        
        return res.send(event)
    })
}

exports.update = async (req,res,next) => {
    if (!req.body) {
        return res.status(400).send({
        message: "Data to update can not be empty!"
        });
    }
    const id = req.query['id'];

    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
    if (!data) {
        res.status(404).send({
            message: `Cannot update examiner with id=${id}. Maybe Examiner was not found!`
        });
    } else res.send({ message: "Examiner was updated successfully." });
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Examiner with id=" + id
        });
    });
};