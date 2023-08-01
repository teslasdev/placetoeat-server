module.exports = (sequelize, Sequelize) => {
   const POST = sequelize.define("post", {
      post_id: {
         type: Sequelize.STRING
      },
      title: {
         type: Sequelize.STRING
      },
      content: {
         type: Sequelize.TEXT
      },
      slug: {
         type: Sequelize.STRING
      },
      featured_img: {
         type: Sequelize.STRING
      },
      images: {
         type: Sequelize.STRING
      },
      status: {
         type: Sequelize.BOOLEAN,
      },
   });
 
   return POST;
 };