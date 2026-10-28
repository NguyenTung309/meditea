const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../auth/checkAuth");
const { authUser, authAdmin } = require("../middleware/authUser");
const contentController = require("../controllers/content.controller");

router.get("/", asyncHandler(contentController.getAll));
router.get("/:key", asyncHandler(contentController.getByKey));
router.put("/:key", authUser, authAdmin, asyncHandler(contentController.update));

module.exports = router;
