const express = require("express");
const router = express.Router();
const { authAdmin } = require("../middleware/authUser");
const { asyncHandler } = require("../auth/checkAuth");
const couponController = require("../controllers/coupon.controller");
router.post("/create", authAdmin, asyncHandler(couponController.createCoupon));

router.get("/list", authAdmin, asyncHandler(couponController.getAllCoupon));

router.put(
  "/update/:id",
  authAdmin,
  asyncHandler(couponController.updateCoupon),
);
router.delete(
  "/delete/:id",
  authAdmin,
  asyncHandler(couponController.deleteCoupon),
);

module.exports = router;
