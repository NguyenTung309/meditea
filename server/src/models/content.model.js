const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stepSchema = new Schema({
  title: { type: String, default: "" },
  desc:  { type: String, default: "" },
  icon:  { type: String, default: "" },
  img:   { type: String, default: "" },
  imgs:  { type: [String], default: [] },
}, { _id: false });

const itemSchema = new Schema({
  num: { type: String, default: "" },
  text: { type: String, default: "" },
}, { _id: false });

const contentSchema = new Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, default: "" },
  text: { type: String, default: "" },
  image: { type: String, default: "" },
  subtext: { type: String, default: "" },
  // Multiple images for sections that need them
  image2: { type: String, default: "" },
  image3: { type: String, default: "" },
  // 6 steps for Gia Tri Nguyen Ban section
  steps: [stepSchema],
  // 4 items for MEDITEA - LA TRA GIA NGUYEN BAN section
  items: [itemSchema],
  // Footer-specific fields
  address:       { type: String, default: "" },
  phone:         { type: String, default: "" },
  contact_email: { type: String, default: "" },
  business_name: { type: String, default: "" },
  business_reg:  { type: String, default: "" },
  reg_date:      { type: String, default: "" },
  reg_place:     { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Content", contentSchema);