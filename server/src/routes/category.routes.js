const express = require("express");
const { asyncHandler } = require("../auth/checkAuth");
const categoryController = require("../controllers/category.controller");
const { authAdmin } = require("../middleware/authUser");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/categorys");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post(
  "/create",
  authAdmin,
  upload.single("imageCategory"),
  asyncHandler(categoryController.createCategory),
);
router.get("/list", asyncHandler(categoryController.getAllCategory));
router.put(
  "/update/:id",
  authAdmin,
  upload.single("imageCategory"),
  asyncHandler(categoryController.updateCategory),
);
router.delete(
  "/delete/:id",
  authAdmin,
  asyncHandler(categoryController.deleteCategory),
);
module.exports = router;
