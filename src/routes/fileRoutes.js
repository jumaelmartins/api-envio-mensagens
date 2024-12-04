const express = require("express");
const multer = require("multer");
const { sendFile } = require("../controllers/fileController");

// const upload = multer({ dest: "uploads/" }); // Configura o destino para uploads
const router = express.Router();

// router.post("/send-file", upload.single("file"), sendFile);

module.exports = router;
