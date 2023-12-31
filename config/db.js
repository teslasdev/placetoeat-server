const Sequelize = require('sequelize')
const sequelize = new Sequelize(
  process.env.DB_SERVER,
  process.env.DB_USER,
  process.env.DB_PASS,
{
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port : process.env.DB_PORT
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.posts = require("../Model/post.model.js")(sequelize, Sequelize);
db.cities = require("../Model/city.model.js")(sequelize, Sequelize);
db.auth = require("../Model/auth.model.js")(sequelize, Sequelize);
db.roles = require("../Model/role.model.js")(sequelize, Sequelize);
db.prompt = require("../Model/prompt.model.js")(sequelize, Sequelize);
db.preference = require("../Model/preferences.model.js")(sequelize, Sequelize);
db.roles.belongsToMany(db.auth, {
  through: "user_roles"
});
db.auth.belongsToMany(db.roles, {
  through: "user_roles"
});

db.ROLES = ["user", "admin", "moderator"];
module.exports = db;