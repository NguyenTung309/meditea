// routes/auth.routes.js
const express = require("express");
const { authAdmin } = require("../middleware/authUser");
const router = express.Router();

router.get("/admin-check", authAdmin, (req, res) => {
  return res.status(200).json({
    message: "OK",
    metadata: { isAdmin: true },
  });
});

module.exports = router;
