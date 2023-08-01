module.exports = (sequelize, Sequelize) => {
   const CITY = sequelize.define("cities", {
      name: {
         type: Sequelize.STRING
      },
      description: {
         type: Sequelize.STRING
      },
      status: {
         type: Sequelize.BOOLEAN
      },
      featured_img: {
         type: Sequelize.STRING
      },
   });
 
   return CITY;
 };