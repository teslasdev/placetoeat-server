module.exports = app => {
   const posts = require("../Controllers/prompt.controller.js");
 
   var router = require("express").Router();
 
   // Create a new Tutorial
   router.post("/", posts.create);
 
   // Retrieve all Tutorials
   router.get("/", posts.findAll);
 
   // Retrieve all published Tutorials
   router.get("/slug/:slug", posts.findBySlug);
 
   // Retrieve a single Tutorial with id
   router.get("/:id", posts.findOne);
 
   // Update a Tutorial with id
   router.put("/:id", posts.update);
 
   // Delete a Tutorial with id
   router.delete("/:id", posts.delete);
 
   // Delete all Tutorials
   router.delete("/", posts.deleteAll);
 
   app.use('/api/prompt', router);
 };