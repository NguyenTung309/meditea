const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { asyncHandler } = require("../auth/checkAuth");
const { authUser, authAdmin } = require("../middleware/authUser");
const uploadController = require("../controllers/upload.controller");

const uploadDir = path.join(__dirname, "../uploads/content");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

router.post("/", authUser, authAdmin, upload.single("image"), asyncHandler(uploadController.uploadImage));

module.exports = router;
