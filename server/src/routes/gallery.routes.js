const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authAdmin, authUser } = require("../middleware/authUser");
const { asyncHandler } = require("../auth/checkAuth");
const galleryController = require("../controllers/gallery.controller");

const uploadDir = path.join(__dirname, "../uploads/gallery");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/list", asyncHandler(galleryController.listImages));
router.post("/upload", authUser, authAdmin, upload.single("image"), asyncHandler(galleryController.uploadImage));
router.delete("/:id", authUser, authAdmin, asyncHandler(galleryController.deleteImage));

module.exports = router;
