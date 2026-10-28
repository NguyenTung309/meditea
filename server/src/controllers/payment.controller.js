const cartModel = require("../models/cart.model");
const paymentModel = require("../models/payment.model");
const couponModel = require("../models/coupon.model");

const { NotFoundError, BadRequestError, AuthFailureError } = require("../core/error.response");
const { sendOrderMail, sendAdminNotification } = require("../utils/mailOrder");
const { Created, OK } = require("../core/success.response");

const crypto = require("crypto");
const https = require("https");

function generatePayID() {
  // Tạo ID thanh toán bao gồm cả giây để tránh trùng lặp
  const now = new Date();
  const timestamp = now.getTime();
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const milliseconds = now.getMilliseconds().toString().padStart(3, "0");
  return `PAY${timestamp}${seconds}${milliseconds}`;
}

class PaymentController {
  async createPayment(req, res) {
    const { typePayment } = req.body;
    const id = req.user;

    const findCartUser = await cartModel.findOne({ userId: id });

    if (!findCartUser) {
      throw new NotFoundError("Giỏ hàng không tồn tại");
    }

    if (findCartUser.products.length === 0) {
      throw new BadRequestError("Giỏ hàng không có sản phẩm");
    }

    if (typePayment === "cod") {
      const newPayment = await paymentModel.create({
        userId: id,
        products: findCartUser.products,
        totalPrice: findCartUser.totalPrice,
        fullName: findCartUser.fullName,
        phoneNumber: findCartUser.phoneNumber,
        address: findCartUser.address,
        email: findCartUser.email,
        finalPrice: findCartUser.finalPrice,
        couponId: findCartUser.couponId,
        paymentMethod: "cod",
        status: "pending",
      });

      await findCartUser.deleteOne();
      await cartModel.create({
        userId: id,
        products: [],
      });

      await couponModel.findByIdAndUpdate(findCartUser.couponId, {
        $inc: { quantity: -1 },
      });

      // Gửi mail xác nhận
      sendOrderMail(newPayment);
      sendAdminNotification(newPayment);

      return new Created({
        message: "Tạo đơn hàng thành công",
        metadata: newPayment,
      }).send(res);
    } else if (typePayment === "sepay") {
      const newPayment = await paymentModel.create({
        userId: id,
        products: findCartUser.products,
        totalPrice: findCartUser.totalPrice,
        fullName: findCartUser.fullName,
        phoneNumber: findCartUser.phoneNumber,
        address: findCartUser.address,
        email: findCartUser.email,
        finalPrice: findCartUser.finalPrice,
        couponId: findCartUser.couponId,
        paymentMethod: "sepay",
        status: "pending",
      });

      await findCartUser.deleteOne();
      await cartModel.create({
        userId: id,
        products: [],
      });

      if (findCartUser.couponId) {
        await couponModel.findByIdAndUpdate(findCartUser.couponId, {
          $inc: { quantity: -1 },
        });
      }

      return new Created({
        message: "Đã ghi nhận đơn, chờ thanh toán",
        metadata: newPayment,
      }).send(res);
    }
  }

  async sepayWebhook(req, res) {
    const authHeader = req.headers.authorization;
    const webhookKey = process.env.SEPAY_WEBHOOK_KEY || "sepay_webhook_secret_key_12345";

    // Xác thực request từ SePay (được truyền qua Header Authorization: Apikey <api_key>)
    if (!authHeader || !authHeader.includes(webhookKey)) {
      throw new AuthFailureError("Unauthorized Webhook request");
    }

    const { transferType, transferAmount, content } = req.body;

    // Chỉ xử lý giao dịch nhận tiền
    if (transferType !== "in") {
      return new OK({
        message: "Ignore cash out transaction",
        metadata: false,
      }).send(res);
    }

    // Tìm mã đơn hàng DHxxxx trong nội dung giao dịch (Regex tìm DH followed by 24 hex characters)
    const match = (content || "").match(/DH([0-9a-fA-F]{24})/);
    if (!match) {
      throw new BadRequestError("Invalid transaction content format");
    }

    const orderId = match[1];
    const findPayment = await paymentModel.findById(orderId);

    if (!findPayment) {
      throw new NotFoundError("Đơn hàng không tồn tại");
    }

    if (findPayment.status !== "pending") {
      return new OK({
        message: "Đơn hàng đã được xử lý từ trước",
        metadata: findPayment,
      }).send(res);
    }

    // Xác thực số tiền
    const expectedPrice = findPayment.couponId ? findPayment.finalPrice : findPayment.totalPrice;
    if (Number(transferAmount) < Number(expectedPrice)) {
      throw new BadRequestError("Số tiền thanh toán không khớp");
    }

    // Cập nhật trạng thái đơn hàng sang "confirmed"
    findPayment.status = "confirmed";
    await findPayment.save();

    // Gửi mail xác nhận
    sendOrderMail(findPayment);
    sendAdminNotification(findPayment);

    return new OK({
      message: "Thanh toán đơn hàng thành công",
      metadata: findPayment,
    }).send(res);
  }

  async getPaymentsAdmin(req, res) {
    const dataPayment = await paymentModel
      .find({})
      .populate("userId", "fullName email")
      .populate("products.productId", "")
      .populate("couponId");
    return new OK({
      message: "Lấy danh sách đơn hàng thành công",
      metadata: dataPayment,
    }).send(res);
  }

  async updatePayment(req, res) {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!orderId || !status) {
      throw new BadRequestError("Bạn đang thiếu thông tin");
    }

    const findPayment = await paymentModel.findById(orderId);
    if (!findPayment) {
      throw new NotFoundError("Đơn hàng không tồn tại");
    }

    findPayment.status = status;
    await findPayment.save();
    return new OK({
      message: "Cập nhật đơn hàng thành công",
      metadata: findPayment,
    }).send(res);
  }

  async getPaymentById(req, res) {
    const { orderId } = req.params;
    const findPayment = await paymentModel
      .findById(orderId)
      .populate("userId", "fullName email")
      .populate("products.productId", "")
      .populate("couponId");
    if (!findPayment) {
      throw new NotFoundError("Đơn hàng không tồn tại");
    }
    return new OK({
      message: "Lấy đơn hàng thành công",
      metadata: findPayment,
    }).send(res);
  }

  async getSalesReport(req, res) {
    const { type } = req.query;
    const payments = await paymentModel.find({});
    const totalOrders = payments.length;
    const totalRevenue = payments.reduce((sum, p) => sum + (p.finalPrice || p.totalPrice || 0), 0);
    const completedOrders = payments.filter(p => p.status === "completed").length;
    const pendingOrders = payments.filter(p => p.status === "pending").length;
    return new OK({
      message: "OK",
      metadata: { summary: { totalOrders, totalRevenue, completedOrders, pendingOrders } }
    }).send(res);
  }
}

module.exports = new PaymentController();
