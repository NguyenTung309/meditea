require("dotenv").config({ path: __dirname + "/../../.env" });
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

// Initialize R2 Client
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

async function uploadFileToR2(filePath, r2Key) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const contentType = mime.lookup(filePath) || "application/octet-stream";

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: r2Key,
      Body: fileContent,
      ContentType: contentType,
    });

    await s3.send(command);
    console.log(`✅ Uploaded: ${r2Key}`);
  } catch (err) {
    console.error(`❌ Failed to upload ${r2Key}:`, err);
  }
}

async function uploadDirectory(dirPath, r2Prefix) {
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️ Directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      const r2Key = `${r2Prefix}/${file}`;
      await uploadFileToR2(filePath, r2Key);
    } else if (stat.isDirectory()) {
      await uploadDirectory(filePath, `${r2Prefix}/${file}`);
    }
  }
}

async function startUpload() {
  console.log("🚀 Bắt đầu upload ảnh và video tĩnh lên R2...");
  const publicDir = path.join(__dirname, "../../../frontend/public");

  // Upload images
  const imagesDir = path.join(publicDir, "images");
  await uploadDirectory(imagesDir, "images");

  // Upload 3D models
  const modelsDir = path.join(publicDir, "3D");
  await uploadDirectory(modelsDir, "3D");

  console.log("🎉 Hoàn tất upload static files lên R2!");
}

startUpload();
