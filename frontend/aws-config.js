import AWS from "aws-sdk";

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY, // Stored in .env
  secretAccessKey: process.env.AWS_SECRET, // Stored in .env
  region: "us-east-2", // Change to your AWS region
  signatureVersion: "v4",
});

const BUCKET_NAME = "cs4800domain"; // Change to your bucket name

export { s3, BUCKET_NAME };
