const db = require("../config/db.js");
const Preference = db.preference;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = async (req, res) => {
   try {
      const  data  = req.body;
      const nameExist = await Preference.findOne({
        where: {
          name: data.name
        }
      })
      if(nameExist) {
         return res.status(400).json({
            success: false,
            message:"Preferences Name Exist"
         });
      }
      Preference.create(data)
         .then(result => {
           res.status(200).send({
            data : result,
            id : result.id
           });
         })
   } catch(err) {
      res.status(500).json({
        message: err.message || "Some error occurred while uploading the Post."
      });
   }
};

// Retrieve all Posts from the database.
exports.findAll = (req, res) => {
   Preference.findAll({
      where : {
         type : req.params.type
      }
   })
   .then(data => {
      res.send({
         success : true,
         data : data
      });
   })
   .catch(err => {
     res.status(500).send({
       message:
         err.message || "Some error occurred while retrieving tutorials."
     });
   });
};

// Find a single Posts with an id
exports.findOne = (req, res) => {
   
};

// Update a Posts by the id in the request
exports.update = (req, res) => {
   
};


// Delete a Posts with the specified id in the request
exports.delete = (req, res) => {
   const id = req.params.id;

   Preference.destroy({
    where: { id: id }
   })
   .then(num => {
      if (num == 1) {
        res.send({
          message: "Deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Post with id=${id}. Maybe Preference was not found!`
        });
      }
   })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Preference with id=" + id
      });
   });
  
};

// Delete all Posts from the database.
exports.deleteAll = (req, res) => {
  
};

// Find all published Posts
exports.findBySlug = (req, res) => {
};
