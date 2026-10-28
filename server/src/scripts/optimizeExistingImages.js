require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const { s3, uploadBufferToR2 } = require("../config/r2");
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { compressImageBuffer } = require("../utils/optimizeImage");
const mime = require("mime-types");

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN;
const CUSTOM_DOMAIN = "https://images.meditea.vn";

function extractR2Key(url) {
  if (url.startsWith(CUSTOM_DOMAIN + "/")) return url.slice(CUSTOM_DOMAIN.length + 1);
  if (url.startsWith(R2_PUBLIC_DOMAIN + "/")) return url.slice(R2_PUBLIC_DOMAIN.length + 1);
  return null;
}

async function downloadFromR2(key) {
  const { Body, ContentType } = await s3.send(new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  }));
  const chunks = [];
  for await (const chunk of Body) chunks.push(chunk);
  return { buffer: Buffer.concat(chunks), contentType: ContentType || "image/jpeg" };
}

async function reuploadCompressed(key, buffer, contentType) {
  const mimeType = contentType.split(";")[0].trim();
  const compressed = await compressImageBuffer(buffer, mimeType);
  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: compressed,
    ContentType: mimeType,
  }));
  const saved = ((1 - compressed.length / buffer.length) * 100).toFixed(1);
  console.log(`  ✓ ${key} — ${(buffer.length / 1024).toFixed(0)}KB → ${(compressed.length / 1024).toFixed(0)}KB (−${saved}%)`);
}

async function collectImageUrls() {
  const Content = require("../models/content.model");
  const Product = require("../models/product.model");
  const Category = require("../models/category.model");

  const urls = new Set();

  const contents = await Content.find();
  for (const c of contents) {
    if (c.image) urls.add(c.image);
    if (c.image2) urls.add(c.image2);
    (c.steps || []).forEach(s => { if (s.img) urls.add(s.img); });
    (c.items || []).forEach(i => { if (i.text?.startsWith("http")) urls.add(i.text); });
  }

  const products = await Product.find();
  for (const p of products) {
    (p.imagesProduct || []).forEach(img => { if (img) urls.add(img); });
  }

  const categories = await Category.find();
  for (const c of categories) {
    if (c.imageCategory) urls.add(c.imageCategory);
  }

  return [...urls];
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Kết nối MongoDB thành công\n");

  const urls = await collectImageUrls();
  console.log(`Tìm thấy ${urls.length} ảnh cần xử lý\n`);

  let skipped = 0, optimized = 0, errors = 0;

  for (const url of urls) {
    const key = extractR2Key(url);
    if (!key) { console.log(`  ⏭ Skip (not R2): ${url}`); skipped++; continue; }

    const ext = key.split(".").pop()?.toLowerCase();
    if (ext === "webp" || ext === "mp4" || ext === "webm" || ext === "gif") {
      skipped++;
      continue;
    }

    try {
      const { buffer, contentType } = await downloadFromR2(key);
      await reuploadCompressed(key, buffer, contentType);
      optimized++;
    } catch (err) {
      console.error(`  ✗ ${key}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nHoàn thành: ${optimized} optimized, ${skipped} skipped, ${errors} errors`);
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
