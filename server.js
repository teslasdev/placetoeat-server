const express = require('express');
const  dotenv  = require('dotenv');
const  useragent  = require("express-useragent");
const cors =  require('cors');
const morgan = require("morgan");
const { Configuration, OpenAIApi } = require('openai');


// Load environment variables via config.env if in development
dotenv.config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});


const openai = new OpenAIApi(configuration);


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
const { upload , s3 } = require('./config/s3.js');
const Role = db.roles;
const Prompt = db.prompt;
const City = db.cities;
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
  console.log(process.env.OPENAI_API_KEY)
})

// Routes

require("./routes/post.route.js")(app);
require("./routes/auth.route.js")(app);
require('./routes/user.route.js')(app);
require('./routes/city.route.js')(app);
require('./routes/preferences.route.js')(app);
require('./routes/prompt.route.js')(app);

function initial() {
  Prompt.create({
    id: 1,
    prompt: ""
  });
}

app.post("/api/upload_files",upload, uploadFiles);
async function uploadFiles(req, res) {
  console.log('success')
}
app.post('/api', async (req, res) => {
  try {
    const data = req.body
    const promptFromSystem = data.system;
    const preference = "[Preferences]"
    const cuisine = "[Cuisine]"
    const search = "[Search City by User]"
    var prompt = "";
    if(data.system.includes(search)) {
      prompt = promptFromSystem.replace(search , data.prompt.toString())

      if(prompt.includes(preference)) {
        prompt = prompt.replace(preference , data.preference.toString())
        if(prompt.includes(cuisine)) {
          prompt = prompt.replace(cuisine , data.cuisine.toString())
        } 
      } else {
        prompt = prompt.replace(cuisine , data.cuisine.toString())
      } 
      console.log(prompt)
    }

    const shape ={
      attributes : [
        {
          name :"",
          description : "",
          website: "",
          address :"",
          hotline : "",
          region : "",
          price_in_dollar : null,
          preferences : [],
          region : ""
        }
      ]
    }
    prompt = prompt + "price in dollar , cuisin , food preference , and regios";
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages : [
        {
          role: 'user',
          content : `${prompt}. Return the response as a JSON Object with a shape of ${JSON.stringify(shape)}`,
        }
      ],
    });

    const result = JSON.parse(response.data.choices[0].message.content);
    console.log(result)
    res.status(200).send({
      success : true,
      result 
    }
    );

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));