module.exports = (sequelize, Sequelize) => {
   const Prompt = sequelize.define("prompt", {
     id: {
       type: Sequelize.INTEGER,
       primaryKey: true
     },
     prompt: {
       type: Sequelize.STRING
     }
   });
   return Prompt;
 };