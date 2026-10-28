const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
const fs = require("fs/promises");
const path = require("path");

require("dotenv").config();

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN;

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a local file to R2
 * @param {string} filePath - Path to the local file
 * @param {string} folder - Destination folder in R2 (e.g., "products")
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
const uploadToR2 = async (filePath, folder) => {
  const fileContent = await fs.readFile(filePath);
  const fileName = path.basename(filePath);
  const fileKey = `${folder}/${Date.now()}-${fileName}`;
  const contentType = mime.lookup(filePath) || "application/octet-stream";

  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
      Body: fileContent,
      ContentType: contentType,
    })
  );

  return `${R2_PUBLIC_DOMAIN}/${fileKey}`;
};

/**
 * Upload a buffer directly to R2 (used for migration)
 * @param {Buffer} buffer - File buffer
 * @param {string} fileName - Name of the file
 * @param {string} folder - Destination folder in R2
 * @param {string} contentType - Mime type
 * @returns {Promise<string>} - The public URL
 */
const uploadBufferToR2 = async (buffer, fileName, folder, contentType) => {
  const fileKey = `${folder}/${fileName}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return `${R2_PUBLIC_DOMAIN}/${fileKey}`;
};

/**
 * Delete a file from R2
 * @param {string} fileKey - The key of the object in R2 (e.g., "products/123-image.jpg")
 */
const deleteFromR2 = async (fileKey) => {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileKey,
      })
    );
  } catch (error) {
    console.error(`Failed to delete ${fileKey} from R2:`, error);
  }
};

module.exports = {
  s3,
  uploadToR2,
  uploadBufferToR2,
  deleteFromR2,
};
