const express = require("express");
const {
  getActiveContacts,
  getMessagesByContact,
  deleteContact,
  updateContact,
} = require("../controllers/contactController");

const router = express.Router();
router.get("/", getActiveContacts);
router.get("/all-messages/:number", getMessagesByContact);
router.post("/update/:number", updateContact);
router.post("/delete/:number", deleteContact);

module.exports = router;
