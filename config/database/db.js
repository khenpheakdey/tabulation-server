const mongoose = require("mongoose");
const db = require("../../models");
const Role = db.role;

const database = mongoose.connect(
  "mongodb+srv://pheakdeykhen:nagxIn-vuwmoz-2mytcy@etabulation.rylouqi.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, 
    useUnifiedTopology: true, 
  }
).then(()=>{
  console.log("Successfully connect to MongoDB.");
    initial();
}).catch(error => {
   console.error("Connection error", error);
    process.exit();
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "examiner"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'examiner' to roles collection");
      });
      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}

module.exports = database;
