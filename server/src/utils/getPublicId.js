function getPublicId(urlStr) {
  try {
    const url = new URL(urlStr);
    // Remove the leading slash to get the S3 object key
    // e.g., "/products/123.jpg" -> "products/123.jpg"
    let key = url.pathname;
    if (key.startsWith("/")) {
      key = key.substring(1);
    }
    return key;
  } catch (error) {
    // Fallback if it's not a valid URL (e.g. just a filename)
    return urlStr;
  }
}

module.exports = getPublicId;
