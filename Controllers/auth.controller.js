const db = require("../config/db.js");
const config = require("../config/auth.config");
const User = db.auth;
const Role = db.roles;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.signup = (req, res) => {
   // Save User to Database
    User.create({
     username: req.body.username,
     email: req.body.email,
     password: bcrypt.hashSync(req.body.password, 8)
    })
     .then(user => {
       if (req.body.roles) {
         Role.findAll({
           where: {
             name: {
               [Op.or]: req.body.roles
             }
           }
         }).then(roles => {
           user.setRoles(roles).then(() => {
             res.send({ message: "User was registered successfully!" });
           });
         });
       } else {
         // user role = 1
         user.setRoles([1]).then(() => {
           res.send({ message: "User was registered successfully!" });
         });
       }
     })
     .catch(err => {
       res.status(500).send({ success : true , message: err.message });
     });
 };


//  Sign In
 exports.signin = (req, res) => {
   const {data } = req.body
   User.findOne({
     where: {
      email: data.email
     }
   })
      .then(user => {
       if (!user) {
         return res.status(404).send({ success : false , message: "User Not found." });
       }
 
       var passwordIsValid = bcrypt.compareSync(
         data.password,
         user.password
       );
 
       if (!passwordIsValid) {
         return res.status(401).send({
           success : false,
           accessToken: null,
           message: "Invalid Password!"
         });
       }
 
       const token = jwt.sign({ id: user.id },
         config.secret,
         {
           algorithm: 'HS256',
           allowInsecureKeySizes: true,
           expiresIn: 86400, // 24 hours
         });
 
       var authorities = [];
       user.getRoles().then(roles => {
         for (let i = 0; i < roles.length; i++) {
           authorities.push("ROLE_" + roles[i].name.toUpperCase());
         }
         res.status(200).send({
           success : true,
           accessToken: token
         });
       });
     })
     .catch(err => {
       res.status(500).send({ success : false , message: err.message });
     });
 };
 