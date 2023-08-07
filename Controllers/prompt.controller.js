const db = require("../config/db.js");
const Prompt = db.prompt;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = async (req, res) => {
};

// Retrieve all Posts from the database.
exports.findAll = (req, res) => {
};

// Find a single Prompt with an id
exports.findOne = (req, res) => {
   const id = req.params.id;
   Prompt.findByPk(id)
     .then(data => {
       if (data) {
         res.send({
            data : data,
            success : true,
         });
         console.log(data)
       } else {
         res.status(404).send({
           message: `Cannot find Prompt with id=${id}.`
         });
       }
     })
     .catch(err => {
       res.status(500).send({
         message: "Error retrieving Prompt with id=" + id
       });
     });
};

// Update a Posts by the id in the request
exports.update = (req, res) => {
   const id = req.params.id;
   console.log(req.body)
   Prompt.update(req.body, {
     where: { id: id }
   })
     .then(num => {
       if (num == 1) {
         res.send({
           prompt : req.body.prompt,
           message: "Prompt was updated successfully.",
         });
       } else {
         res.send({
           message: `Cannot update Prompt with id=${id}. Maybe Prompt was not found`
         });
       }
     })
     .catch(err => {
       res.status(500).send({
         message: "Error updating Prompt with id=" + id
       });
     });
};


// Delete a Posts with the specified id in the request
exports.delete = (req, res) => {
};

// Delete all Posts from the database.
exports.deleteAll = (req, res) => {
  
};

// Find all published Posts
exports.findBySlug = (req, res) => {
};
