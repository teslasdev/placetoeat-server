module.exports = app => {
   const preference = require("../Controllers/preferences.controller.js");
 
   var router = require("express").Router();
 
   // Create a new Tutorial
   router.post("/", preference.create);
 
   // Retrieve all Tutorials
   router.get("/:type", preference.findAll);
 
   // Retrieve all published Tutorials
   router.get("/slug/:slug", preference.findBySlug);
 
   // Retrieve a single Tutorial with id
   router.get("/:id", preference.findOne);
 
   // Update a Tutorial with id
   router.put("/:id", preference.update);
 
   // Delete a Tutorial with id
   router.delete("/:id", preference.delete);
 
   // Delete all Tutorials
   router.delete("/", preference.deleteAll);
 
   app.use('/api/preference', router);
 };