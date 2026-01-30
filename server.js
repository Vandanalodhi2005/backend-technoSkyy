const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Email Configuration
const contactEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

contactEmail.verify((error) => {
    if (error) {
        if (error.responseCode === 535) {
            console.error("❌ ERROR: Email authentication failed!");
            console.error("👉 CAUSE: The password in .env is incorrect or not an App Password.");
            console.error("👉 FIX: Generate a new App Password at https://myaccount.google.com/apppasswords and update the EMAIL_PASS in your .env file.");
        } else {
            console.error("❌ Error verifying email transporter:", error);
        }
    } else {
        console.log("✅ Ready to Send Emails");
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
        from: fullName,
        to: "vandanarajpoot69@gmail.com",
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
        await contactEmail.sendMail(mailOptions);
        res.status(200).json({ status: "Message Sent Successfully" });
    } catch (error) {
        console.error("Error sending contact email:", error);
        res.status(500).json({ error: "Failed to send message" });
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
        from: fullName,
        to: "vandanarajpoot69@gmail.com",
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
        await contactEmail.sendMail(mailOptions);
        res.status(200).json({ status: "Application Submitted Successfully" });
    } catch (error) {
        console.error("Error sending application email:", error);
        res.status(500).json({ error: "Failed to send application" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
