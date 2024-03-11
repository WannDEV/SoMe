import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { config } from "dotenv";
import { v4 as uuidv4 } from "uuid";

config();

// Initialize AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Define allowed file types
const allowedFileTypes = ["image/png", "image/jpeg", "image/gif"];

// Multer upload middleware with S3 storage
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      // get file extension from file.mimetype
      const extension = file.mimetype.split("/")[1];
      cb(null, `images/${uuidv4()}.${extension}`); // Using fileType to determine the file extension
    },
  }),
  fileFilter: (req, file, cb) => {
    // Check if the file type is allowed
    const isAllowed = allowedFileTypes.includes(file.mimetype);
    if (!isAllowed) {
      return cb(new Error("Unsupported file type"));
    }
    cb(null, isAllowed);
  },
});
