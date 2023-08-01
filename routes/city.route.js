module.exports = app => {
   const cities = require("../Controllers/city.controller.js");
 
   var router = require("express").Router();
 
   // Create a new Tutorial
   router.post("/", cities.create);
 
   // Retrieve all Tutorials
   router.get("/", cities.findAll);
 
   // Retrieve all published Tutorials
   router.get("/slug/:slug", cities.findBySlug);
 
   // Retrieve a single Tutorial with id
   router.get("/:id", cities.findOne);
 
   // Update a Tutorial with id
   router.put("/:id", cities.update);
 
   // Delete a Tutorial with id
   router.delete("/:id", cities.delete);
 
   // Delete all Tutorials
   router.delete("/", cities.deleteAll);
 
   app.use('/api/cities', router);
 };