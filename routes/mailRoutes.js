const express = require("express");
const { sendMail, sendCareerMail } = require("../controllers/sendMailController");

const router = express.Router();

router.post("/send-mail", sendMail);
router.post("/apply", sendCareerMail);

module.exports = router;
