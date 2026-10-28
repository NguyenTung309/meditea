const fs = require("fs/promises");
const { uploadBufferToR2 } = require("../config/r2");
const { optimizeImageBuffer } = require("../utils/optimizeImage");
const { OK } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

class UploadController {
  async uploadImage(req, res) {
    if (!req.file) throw new BadRequestError("Không có file được gửi lên");

    const { path: tempPath } = req.file;
    let webpBuffer;

    try {
      const rawBuffer = await fs.readFile(tempPath);
      webpBuffer = await optimizeImageBuffer(rawBuffer);
    } finally {
      await fs.unlink(tempPath).catch(console.error);
    }

    const fileName = `${Date.now()}.webp`;
    const url = await uploadBufferToR2(webpBuffer, fileName, "content", "image/webp");

    return new OK({ message: "Upload thành công", metadata: { url } }).send(res);
  }
}

module.exports = new UploadController();
