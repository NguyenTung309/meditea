const express = require("express");
const router = express.Router();
const { authAdmin, authUser } = require("../middleware/authUser");
const { asyncHandler } = require("../auth/checkAuth");
const paymentController = require("../controllers/payment.controller");

router.post("/create", authUser, asyncHandler(paymentController.createPayment));
router.post("/sepay-webhook", asyncHandler(paymentController.sepayWebhook));
router.get("/order/:orderId", authUser, asyncHandler(paymentController.getPaymentById));
router.get("/admin/list", authAdmin, asyncHandler(paymentController.getPaymentsAdmin));
router.get("/admin/report", authAdmin, asyncHandler(paymentController.getSalesReport));
router.put("/admin/update/:orderId", authAdmin, asyncHandler(paymentController.updatePayment));

module.exports = router;
