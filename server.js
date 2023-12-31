const express = require('express');
const  dotenv  = require('dotenv');
const  useragent  = require("express-useragent");
const cors =  require('cors');
const morgan = require("morgan");
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');


// Load environment variables via config.env if in development
dotenv.config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});


const openai = new OpenAIApi(configuration);


const PORT = 8080;
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
  Role.create({
    id: 1,
    name: "Admin"
  });
}

app.post("/api/upload_files",upload, uploadFiles);
async function uploadFiles(req, res) {
  console.log('success')
}
app.post('/api', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
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
    // const response = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages : [
    //     {
    //       role: 'user',
    //       content : `${prompt}. Return the response as a JSON Object with a shape of ${JSON.stringify(shape)}`,
    //     }
    //   ],
    //   temperature: 0.7,
    //   stream: true,  
    // },{ responseType: 'stream' });

    // const result = JSON.parse(response.data.choices[0].message.content);
    // console.log(result)
    // res.status(200).send({
    //   success : true,
    //   result 
    // }

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages : [
            {
              role: 'user',
              content : `${prompt}. Return an array of 5 JSON objects. Each object contains 8 keys - name , description,website, address,hotline ,region,price_in_dollar,preferences : [],region like eastern western south middle eastern south. Values are random words.  Return only the JSON array. Do not include any additional commentary in the response.`,
            }
          ],
      stream: true,
    }, { responseType: 'stream' });

    const stream = completion.data;
    let result = '';
    stream.on('data', (chunk) => {
      const payloads = chunk.toString().split("\n\n");
      for (const payload of payloads) {
          if (payload.includes('[DONE]')) return;
          if (payload.startsWith("data:")) {
              const data = JSON.parse(payload.replace("data: ", ""));
              try {
                  const chunk = data.choices[0].delta?.content;
                  result += chunk // accumulate

                  const endIndex = result.indexOf('}');
                  if (endIndex !== -1) {
                    const startIndex = result.indexOf('{');
                    const jsonObject = result.slice(startIndex, endIndex + 1); // Extract the JSON object
                    result = result.slice(endIndex + 1); // Remove the extracted JSON object from the accumulated data
                    const parsedObject = JSON.parse(jsonObject);
                    console.log(parsedObject); // Handle the parsed JSON object here
                    res.write(jsonObject);
                  }
                  // const result = chunk;
                  // console.log(`${chunk}`)
                  // res.write(data.choices[0]?.delta.content || "");
              } catch (error) {
                  console.log(`Error with JSON.parse and ${payload}.\n${error}`);
              }
              
          }
      }
      // res.end();
  });
    stream.on('end', () => {
        res.end();
        setTimeout(() => {
            console.log('\nStream done');
        }, 10);
    });

    stream.on('error', (err) => {
        console.log(err);
        res.send(err);
    });
    } catch (error) {
      console.error(error)
      res.status(500).send(error || 'Something went wrong');
    }
})

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));