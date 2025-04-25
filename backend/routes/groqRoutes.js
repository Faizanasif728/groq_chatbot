const express = require("express");
const router = express.Router();
const { askGroqBot } = require("../controllers/groqController");

router.post("/chat", askGroqBot);

module.exports = router;
