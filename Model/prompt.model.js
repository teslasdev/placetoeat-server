module.exports = (queryInterface,sequelize, Sequelize) => {
   const Prompt = sequelize.define("prompt", {
      id: {
       type: Sequelize.INTEGER,
       primaryKey: true
      },
      prompt: {
        type: Sequelize.TEXT
      }
   });
   return Prompt;
 };