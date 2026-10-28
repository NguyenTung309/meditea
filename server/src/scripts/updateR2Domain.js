require("dotenv").config({ path: __dirname + "/../../.env" });
const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const connectDB = require("../config/connectDB");

// CẤU HÌNH DOMAIN Ở ĐÂY
const OLD_DOMAIN = "https://cdn.meditea.vn";
const NEW_DOMAIN = "https://images.meditea.vn";

async function updateDomain() {
  try {
    await connectDB();
    console.log("Đã kết nối Database");

    let productCount = 0;
    let categoryCount = 0;

    // Cập nhật Products
    const products = await Product.find({});
    for (const product of products) {
      let updated = false;
      const newImages = product.imagesProduct.map((url) => {
        if (url && url.includes(OLD_DOMAIN)) {
          updated = true;
          return url.replace(OLD_DOMAIN, NEW_DOMAIN);
        }
        return url;
      });

      if (updated) {
        product.imagesProduct = newImages;
        await product.save();
        productCount++;
      }
    }
    console.log(`✅ Đã cập nhật domain cho ${productCount} Products`);

    // Cập nhật Categories
    const categories = await Category.find({});
    for (const category of categories) {
      if (category.imageCategory && category.imageCategory.includes(OLD_DOMAIN)) {
        category.imageCategory = category.imageCategory.replace(OLD_DOMAIN, NEW_DOMAIN);
        await category.save();
        categoryCount++;
      }
    }
    console.log(`✅ Đã cập nhật domain cho ${categoryCount} Categories`);

    console.log("🎉 Hoàn tất cập nhật Database!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
}

updateDomain();
