const galleryModel = require("../models/gallery.model");
const { OK, Created } = require("../core/success.response");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { uploadBufferToR2 } = require("../config/r2");
const fs = require("fs/promises");
const path = require("path");
const { optimizeImageBuffer } = require("../utils/optimizeImage");

class GalleryController {
  async uploadImage(req, res) {
    if (!req.file) throw new BadRequestError("Không có file được gửi lên");
    const { category } = req.body;
    if (!category) throw new BadRequestError("Thiếu danh mục");

    const { path: tempPath } = req.file;
    let imageUrl;
    try {
      const rawBuffer = await fs.readFile(tempPath);
      const webpBuffer = await optimizeImageBuffer(rawBuffer);
      const fileName = `gallery-${Date.now()}.webp`;
      
      if (process.env.R2_BUCKET_NAME) {
        // Có R2 -> upload lên Cloudflare R2
        imageUrl = await uploadBufferToR2(webpBuffer, fileName, "gallery", "image/webp");
      } else {
        // Không có R2 -> lưu vào thư mục local
        const localDir = path.join(__dirname, "../uploads/gallery");
        await fs.mkdir(localDir, { recursive: true });
        const localPath = path.join(localDir, fileName);
        await fs.writeFile(localPath, webpBuffer);
        imageUrl = `/uploads/gallery/${fileName}`;
      }
    } finally {
      await fs.unlink(tempPath).catch(console.error);
    }

    const newImage = await galleryModel.create({ imageUrl, category });
    return new Created({ message: "Upload ảnh thành công", metadata: newImage }).send(res);
  }

  async listImages(req, res) {
    const images = await galleryModel.find().sort({ createdAt: -1 });
    return new OK({ message: "Lấy danh sách ảnh thành công", metadata: images }).send(res);
  }

  async deleteImage(req, res) {
    const { id } = req.params;
    const deleted = await galleryModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError("Không tìm thấy ảnh");
    return new OK({ message: "Xóa ảnh thành công", metadata: deleted }).send(res);
  }
}

module.exports = new GalleryController();
