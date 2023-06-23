const express = require("express");
const { sendContact } = require("../controllers/contactController");

const router = express.Router();

router.route("").post(sendContact);

module.exports = router;