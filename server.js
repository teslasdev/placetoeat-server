const express = require('express');
const  dotenv  = require('dotenv');
const  useragent  = require("express-useragent");
const cors =  require('cors');
const morgan = require("morgan");
const multer = require('multer')

// Load environment variables via config.env if in development
dotenv.config();
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });


// const openai = new OpenAIApi(configuration);


const PORT = process.env.DB_PORT || 2000;
// Connect to database
const app = express()
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use(cors());
app.use(useragent.express());
// DB Connection
const db = require("./config/db.js");
const Role = db.roles;


db.sequelize.sync()
  .then(() => {
    console.log("Connected db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });


  //STOP DB CONNECTION

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

// Routes

require("./routes/post.route.js")(app);
require("./routes/auth.route.js")(app);
require('./routes/user.route.js')(app);
require('./routes/city.route.js')(app);






// sequelize.sync()
// app.post('/upload-post' , async (req, res) => { 
//   try {
//     const { body } = req.body;
//     var sql = `INSERT INTO post (post_id ,title,content,slug,featured_img,status) VALUES (?)`;
//     const data = [body.postId , body.title ,body.content,'' ,0,2];
//     conn.query(sql ,[data], (err, result) => {
//       if (err) throw err;
//       console.log('complete');
//       res.status(200).send({
//         bot: 'Success',
//         id : body.postId
//       });
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).send(error || 'Something went wrong');
//   }
// })
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads');
  },
  filename: function (req, file, callback) {
      callback(null, file.originalname);
  }
});
function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}
app.post("/api/upload_files", multer({ storage: storage }).single('files'), uploadFiles);
function uploadFiles(req, res) {
    res.json({ message: "Successfully uploaded files" });
}



// app.post('/', async (req, res) => {
//   try {
//     const { prompt } = req.body;
    
//     // const question = `places to eat in ${prompt} all in JSON format with their details , Description , Price in Dollars , Location ,Hotline, Region,and Website`;

//     // const response = await openai.createCompletion({
//     //   model: "text-davinci-003",
//     //   prompt: `${question}`,
//     //   temperature: 0, // Higher values means the model will take more risks.
//     //   max_tokens: 4000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
//     //   top_p: 1, // alternative to sampling with temperature, called nucleus sampling
//     //   frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
//     //   presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
//     // });

//     // console.log(response.data.choices.slice())
//     // res.status(200).send({
//     //   bot: response.data.choices[0].text
//     // });

//   } catch (error) {
//     console.error(error)
//     res.status(500).send(error || 'Something went wrong');
//   }
// })

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));