const express = require("express");

const upload = require("../config/multerConfig");

const {
  sendMessage,
  getMessages,
  sendBulkMessages,
  getBatchStatus,
  getFailedMessages,
} = require("../controllers/messageController");
const { body } = require("express-validator");
const router = express.Router();
router.get("/", getMessages);
router.get("/get-batch-status/:batchId", getBatchStatus);
router.get("/get-failed-messages/:batchId", getFailedMessages);

router.post(
  "/send-message/:id",
  [
    body("number").isNumeric().isLength({ min: 10, max: 15 }).trim().escape(),
    body("message").isLength({ min: 1, max: 500 }).trim().escape(),
  ],
  sendMessage
);
router.post("/send-bulk-messages/:id", upload.single(), sendBulkMessages);

module.exports = router;
