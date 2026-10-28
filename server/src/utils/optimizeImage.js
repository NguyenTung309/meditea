const sharp = require("sharp");

/**
 * Compress + convert any image buffer to WebP (quality 80, max 1920px wide).
 * Returns a WebP buffer suitable for upload.
 */
async function optimizeImageBuffer(inputBuffer) {
  return sharp(inputBuffer)
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

/**
 * Compress an image buffer in its original format (JPEG/PNG) without format conversion.
 * Used for migrating existing images (preserves extension, no URL change needed).
 */
async function compressImageBuffer(inputBuffer, mimeType) {
  const pipeline = sharp(inputBuffer).resize({ width: 1920, withoutEnlargement: true });
  if (mimeType === "image/png") return pipeline.png({ quality: 80, compressionLevel: 8 }).toBuffer();
  return pipeline.jpeg({ quality: 78, mozjpeg: true }).toBuffer();
}

module.exports = { optimizeImageBuffer, compressImageBuffer };
