const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Email Configuration (SMTP - cPanel)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === "465",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

const RECEIVER_EMAIL = "support@technoskysolution.com";

// Verify SMTP Connection on Startup
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP Auth Error:", error.message);
    } else {
        console.log("✅ SMTP Server is ready for support@technoskysolution.com");
    }
});

// --- ROUTES ---
app.get("/", (req, res) => {
    res.send("Techno Skyy Backend is running.");
});
// 1. Contact Form Endpoint
app.post("/api/send-mail", async (req, res) => {
    const { fullName, email, country, service, message } = req.body;

    if (!fullName || !email || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const mailOptions = {
        from: `"${fullName}" <${process.env.EMAIL_USER}>`,
        to: RECEIVER_EMAIL,
        replyTo: email,
        subject: `Techno Skyy: New Contact Form Submission - ${service || 'General'}`,
        html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Country:</strong> ${country}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ status: "Message Sent Successfully" });
    } catch (error) {
        console.error("Error sending contact email:", error);
        res.status(500).json({
            error: "Failed to send message",
            details: error.message
        });
    }
});

// 2. Career Registration Endpoint
app.post("/api/apply", async (req, res) => {
    const {
        fullName, email, phone, position, location,
        salary, startDate, experience, skills, reason
    } = req.body;

    if (!fullName || !email || !position || !reason) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const mailOptions = {
        from: `"${fullName}" <${process.env.EMAIL_USER}>`,
        to: RECEIVER_EMAIL,
        replyTo: email,
        subject: `Techno Skyy: Job Application - ${position}`,
        html: `
      <h3>New Job Application</h3>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Position:</strong> ${position}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Expected Salary:</strong> ${salary}</p>
      <p><strong>Start Date:</strong> ${startDate}</p>
      <p><strong>Experience:</strong> ${experience}</p>
      <p><strong>Skills:</strong> ${skills}</p>
      <hr />
      <p><strong>Reason for joining:</strong></p>
      <p>${reason}</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ status: "Application Submitted Successfully" });
    } catch (error) {
        console.error("Error sending application email:", error);
        res.status(500).json({
            error: "Failed to send application",
            details: error.message
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
