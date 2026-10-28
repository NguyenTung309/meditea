const { uploadBufferToR2, deleteFromR2 } = require("../config/r2");
const { optimizeImageBuffer } = require("../utils/optimizeImage");
const fs = require("fs/promises");
const { Created, OK } = require("../core/success.response");
const { NotFoundError, BadRequestError } = require("../core/error.response");

const getPublicId = require("../utils/getPublicId");
const productModel = require("../models/product.model");
const cartModel = require("../models/cart.model");

async function uploadImageOptimized(tempPath, folder) {
  const raw = await fs.readFile(tempPath);
  const webp = await optimizeImageBuffer(raw);
  return uploadBufferToR2(webp, `${Date.now()}.webp`, folder, "image/webp");
}

class ProductController {
  async createProduct(req, res) {
    const dataImages = req.files;
    const {
      nameProduct,
      priceProduct,
      discountProduct,
      stockProduct,
      descriptionProduct,
      categoryProduct,
      isHidden,
    } = req.body;

    if (
      nameProduct == null ||
      priceProduct == null ||
      discountProduct == null ||
      stockProduct == null ||
      descriptionProduct == null ||
      categoryProduct == null ||
      isHidden == null ||
      !dataImages ||
      dataImages.length === 0
    ) {
      throw new BadRequestError("Thiếu thông tin sản phẩm");
    }

    let imagesProduct = [];

    for (const image of dataImages) {
      const { path } = image;
      try {
        const url = await uploadImageOptimized(path, "products");
        imagesProduct.push(url);
      } finally {
        await fs.unlink(path).catch(console.error);
      }
    }

    const newProduct = await productModel.create({
      nameProduct,
      priceProduct,
      discountProduct,
      stockProduct,
      descriptionProduct,
      categoryProduct,
      imagesProduct,
      isHidden: typeof isHidden === "boolean" ? isHidden : isHidden === "true",
    });

    return new Created({
      message: "Tạo sản phẩm thành công",
      metadata: newProduct,
    }).send(res);
  }

  async getAllProduct(req, res) {
    const products = await productModel.find();

    return new OK({
      message: "Lấy danh sách sản phẩm thành công",
      metadata: products,
    }).send(res);
  }

  async getAllProductPublic(req, res) {
    const products = await productModel.find({ isHidden: false });

    return new OK({
      message: "Lấy danh sách sản phẩm hiển thị thành công",
      metadata: products,
    }).send(res);
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    const {
      nameProduct,
      priceProduct,
      discountProduct,
      stockProduct,
      descriptionProduct,
      categoryProduct,
      oldImagesProduct,
      isHidden,
    } = req.body;

    const dataImages = req.files;

    if (
      id == null ||
      nameProduct == null ||
      priceProduct == null ||
      discountProduct == null ||
      stockProduct == null ||
      descriptionProduct == null ||
      categoryProduct == null ||
      oldImagesProduct == null ||
      isHidden == null
    ) {
      throw new BadRequestError("Thiếu thông tin sản phẩm");
    }

    const findProduct = await productModel.findById(id);
    if (!findProduct) {
      throw new NotFoundError("Sản phẩm không tồn tại");
    }

    let imagesProduct = [];

    if (dataImages && dataImages.length > 0) {
      for (const image of dataImages) {
        const { path } = image;
        try {
          const url = await uploadImageOptimized(path, "products");
          imagesProduct.push(url);
        } finally {
          await fs.unlink(path).catch(console.error);
        }
      }
    }

    const parsedOldImages = oldImagesProduct
      ? JSON.parse(oldImagesProduct)
      : [];

    const finalImages = [...parsedOldImages, ...imagesProduct];

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        nameProduct,
        priceProduct,
        discountProduct,
        stockProduct,
        descriptionProduct,
        categoryProduct,
        imagesProduct: finalImages,
        isHidden:
          typeof isHidden === "boolean" ? isHidden : isHidden === "true",
      },
      { new: true },
    );

    if (!updatedProduct) {
      throw new NotFoundError("Cập nhật sản phẩm thất bại");
    }

    return new OK({
      message: "Cập nhật thông tin sản phẩm thành công",
      metadata: updatedProduct,
    }).send(res);
  }

  async getProductById(req, res) {
    const { id } = req.params;

    const product = await productModel.findById(id);
    if (!product) {
      throw new NotFoundError("Sản phẩm không tồn tại");
    }

    return new OK({
      message: "Lấy thông tin sản phẩm thành công",
      metadata: product,
    }).send(res);
  }

  async deleteProduct(req, res) {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError("Thiếu thông tin sản phẩm");
    }

    const findProduct = await productModel.findById(id);
    if (!findProduct) {
      throw new NotFoundError("Sản phẩm không tồn tại");
    }

    for (const image of findProduct.imagesProduct) {
      await deleteFromR2(getPublicId(image));
    }

    await findProduct.deleteOne();

    // Xóa sản phẩm khỏi giỏ hàng của tất cả user
    await cartModel.updateMany(
      { "products.productId": id },
      { $pull: { products: { productId: id } } }
    );

    return new OK({
      message: "Xóa sản phẩm thành công",
      metadata: findProduct,
    }).send(res);
  }

  async getProductByCategory(req, res) {
    const { idCategory } = req.params;

    let product = [];
    if (idCategory) {
      product = await productModel.find({
        categoryProduct: idCategory,
        isHidden: false,
      });
    } else {
      product = await productModel.find({ isHidden: false });
    }

    return new OK({
      message: "Lấy sản phẩm theo danh mục thành công",
      metadata: product,
    }).send(res);
  }
}

module.exports = new ProductController();
