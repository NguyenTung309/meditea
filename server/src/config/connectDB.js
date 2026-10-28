const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    console.log("ket noi thanh cong");
  } catch (err) {
  console.error("Loi ket noi MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
