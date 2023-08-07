module.exports = (sequelize, Sequelize) => {
   const PREFERENCE = sequelize.define("preferences", {
      name: {
         type: Sequelize.STRING
      },
      type : {
         type : Sequelize.BOOLEAN
      },
      status: {
         type: Sequelize.BOOLEAN
      },
   });
 
   return PREFERENCE;
 };