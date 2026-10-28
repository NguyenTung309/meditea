const usersRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const productRoutes = require("./product.routes");
const authRoutes = require("./auth.routes");
const couponRoutes = require("./coupon.routes");
const cartRoutes = require("./cart.routes");
const paymentRoutes = require("./payment.routes");
const chatRoutes = require("./chat.routes");
const contentRoutes = require("./content.routes");
const uploadRoutes = require("./upload.routes");
const galleryRoutes = require("./gallery.routes");

function routes(app) {
  app.use("/api/user", usersRoutes);
  app.use("/api/category", categoryRoutes);
  app.use("/api/product", productRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/coupon", couponRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/payment", paymentRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/content", contentRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/gallery", galleryRoutes);
}

module.exports = routes;
