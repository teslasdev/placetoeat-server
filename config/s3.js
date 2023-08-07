const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const uuid = require("uuid").v4;

const { S3_ENDPOINT, BUCKET_NAME ,  ACCESS_KEY_ID , SECRET_KEY} = process.env;

const spacesEndpoint = new aws.Endpoint(S3_ENDPOINT);

const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_KEY
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, {
        fieldName: file.fieldname,
      });
    },
    key: (request, file, cb) => {
      cb(null, file.originalname);
    },
  }),
}).single("file");


module.exports = { upload, s3 };