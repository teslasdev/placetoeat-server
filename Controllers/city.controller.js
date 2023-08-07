const db = require("../config/db.js");
const City = db.cities;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = async (req, res) => {
   try {
      const  data  = req.body;
      const nameExist = await City.findOne({
          where: {
            name: data.name
          }
      })
      if(nameExist) {
          return res.status(201).send({
            success: false,
            message:"City Name Exist"
          });
      } else {
      City.create(data)
        .then(result => {
          res.status(200).send({
           success : true,
           message: "City Added Successfully"
          });
        })
      }
    } catch(err) {
      res.status(500).json({
        message: err.message || "Some error occurred while uploading the Post."
      });
   }
};

// Retrieve all Posts from the database.
exports.findAll = (req, res) => {
   City.findAll()
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
   const id = req.params.id;

   City.findByPk(id)
     .then(data => {
       if (data) {
         res.send({
            data : data,
            success : true,
         });
       } else {
         res.status(404).send({
           message: `Cannot find POST with id=${id}.`
         });
       }
     })
     .catch(err => {
       res.status(500).send({
         message: "Error retrieving Tutorial with id=" + id
       });
     });
};

// Update a Posts by the id in the request
exports.update = (req, res) => {
   const id = req.params.id;
   const {body} = req.body
    const post = {
      title : body.title,
      content : body.content,
      featured_img : body.featured_img,
      status : false,
    }
   City.update(post, {
     where: { id: id }
   })
     .then(num => {
       if (num == 1) {
         res.send({
           id : id,
           message: "Post was updated successfully.",
         });
       } else {
         res.send({
           message: `Cannot update POST with id=${id}. Maybe Post was not found`
         });
       }
     })
     .catch(err => {
       res.status(500).send({
         message: "Error updating POST with id=" + id
       });
     });
};


// Delete a Posts with the specified id in the request
exports.delete = (req, res) => {
   const id = req.params.id;

   City.destroy({
    where: { id: id }
   })
   .then(num => {
      if (num == 1) {
        res.send({
          message: "City was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete City with id=${id}. Maybe Post was not found!`
        });
      }
   })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete City with id=" + id
      });
   });
  
};

// Delete all Posts from the database.
exports.deleteAll = (req, res) => {
  
};

// Find all published Posts
exports.findBySlug = (req, res) => {
   const slug = req.params.slug;
   City.findAll({ where: { slug : slug } })
   .then(data => {
     res.send(
      {
         success : true,
         data : data
      }
     );
   })
   .catch(err => {
     res.status(500).send({
       message:
         err.message || "Some error occurred while retrieving tutorials."
     });
   });

};
