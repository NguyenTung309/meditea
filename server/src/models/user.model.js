const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userModel = new Schema(
  {
    fullName: { type: String, required: true },
    date: { type: String, required: true },
    dob: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, default: "" },
    password: { type: String, required: true },
    // type: { type: String, enum: ["login", "loginGoogle"] },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("User", userModel);
