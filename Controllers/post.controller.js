const db = require("../config/db.js");
const Post = db.posts;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {
   const { data } =req.body;
    const post = {
      post_id : data.postId,
      title : data.title,
      content : data.content,
      status : false,
    }
   Post.create(post)
   .then(result => {
     res.status(200).json({
      data : result,
      id : result.id
     });
   })
   .catch(err => {
     res.status(500).json({
       message:
         err.message || "Some error occurred while uploading the Post."
     });
   });
};

// Retrieve all Posts from the database.
exports.findAll = (req, res) => {
   Post.findAll()
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
   Post.findByPk(id)
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
      slug : body.slug,
      featured_img : body.featured_img,
      status : body.status,
    }
    Post.update(post, {
     where: { id: id }
    })
     .then(num => {
       if (num == 1) {
         res.send({
           id : id,
           slug : body.slug,
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

   Post.destroy({
    where: { id: id }
   })
   .then(num => {
      if (num == 1) {
        res.send({
          message: "Post was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Post with id=${id}. Maybe Post was not found!`
        });
      }
   })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Post with id=" + id
      });
   });
  
};

// Delete all Posts from the database.
exports.deleteAll = (req, res) => {
  
};

// Find all published Posts
exports.findBySlug = (req, res) => {
   const slug = req.params.slug;
   Post.findAll({ where: { slug : slug } })
   .then(data => {
    res.json(
      data
    );
   })
   .catch(err => {
     res.status(500).send({
       message:err.message || "Some error occurred while retrieving tutorials."
     });
   });

};
