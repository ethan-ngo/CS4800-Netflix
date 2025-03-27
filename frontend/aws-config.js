import AWS from "aws-sdk";

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.APP_AWS_ACCESS_KEY, // Stored in .env
  secretAccessKey: process.env.APP_AWS_SECRET, // Stored in .env
  region: "us-west-1", // Change to your AWS region
  signatureVersion: "v4",
});

const BUCKET_NAME = "cs4800lebron"; // Change to your bucket name

export { s3, BUCKET_NAME };
