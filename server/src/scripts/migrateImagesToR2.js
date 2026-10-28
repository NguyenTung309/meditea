require("dotenv").config({ path: __dirname + "/../../.env" });
const mongoose = require("mongoose");
const axios = require("axios");
const path = require("path");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const { uploadBufferToR2 } = require("../config/r2");
const connectDB = require("../config/connectDB");

// Giả định bạn đang dùng URL public của Cloudinary
const isCloudinaryUrl = (url) => url && url.includes("res.cloudinary.com");

async function downloadImageBuffer(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");
    const contentType = response.headers["content-type"];
    return { buffer, contentType };
  } catch (error) {
    console.error(`Lỗi khi tải ảnh từ ${url}:`, error.message);
    return null;
  }
}

async function migrateProducts() {
  console.log("=== Bắt đầu migrate Products ===");
  const products = await Product.find({});
  let count = 0;

  for (const product of products) {
    let updated = false;
    const newImages = [];

    for (const imgUrl of product.imagesProduct) {
      if (isCloudinaryUrl(imgUrl)) {
        console.log(`Đang tải ảnh: ${imgUrl}`);
        const result = await downloadImageBuffer(imgUrl);
        if (result) {
          const fileName = path.basename(new URL(imgUrl).pathname);
          const r2Url = await uploadBufferToR2(
            result.buffer,
            `${Date.now()}-${fileName}`,
            "products",
            result.contentType
          );
          console.log(`=> Đã upload lên R2: ${r2Url}`);
          newImages.push(r2Url);
          updated = true;
        } else {
          // Bỏ qua hoặc giữ nguyên nếu lỗi
          newImages.push(imgUrl);
        }
      } else {
        newImages.push(imgUrl);
      }
    }

    if (updated) {
      product.imagesProduct = newImages;
      await product.save();
      console.log(`Đã cập nhật Product ID: ${product._id}`);
      count++;
    }
  }
  console.log(`=== Đã migrate ${count} Products ===`);
}

async function migrateCategories() {
  console.log("=== Bắt đầu migrate Categories ===");
  const categories = await Category.find({});
  let count = 0;

  for (const category of categories) {
    const imgUrl = category.imageCategory;
    if (isCloudinaryUrl(imgUrl)) {
      console.log(`Đang tải ảnh: ${imgUrl}`);
      const result = await downloadImageBuffer(imgUrl);
      if (result) {
        const fileName = path.basename(new URL(imgUrl).pathname);
        const r2Url = await uploadBufferToR2(
          result.buffer,
          `${Date.now()}-${fileName}`,
          "categorys",
          result.contentType
        );
        console.log(`=> Đã upload lên R2: ${r2Url}`);
        category.imageCategory = r2Url;
        await category.save();
        console.log(`Đã cập nhật Category ID: ${category._id}`);
        count++;
      }
    }
  }
  console.log(`=== Đã migrate ${count} Categories ===`);
}

async function run() {
  try {
    await connectDB();
    console.log("Đã kết nối Database");

    await migrateCategories();
    await migrateProducts();

    console.log("Hoàn thành quá trình Migration!");
    process.exit(0);
  } catch (error) {
    console.error("Lỗi:", error);
    process.exit(1);
  }
}

run();
