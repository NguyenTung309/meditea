const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");

router.post("/ask", chatController.askChatbot);

module.exports = router;
