const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

// Shared Transporter Configuration
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true, // SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false, // Ignore certificate mismatch
        },
    });
};

// POST /api/send-mail
const sendMail = asyncHandler(async (req, res) => {
    console.log("📩 Received Contact Form Submission");
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const transporter = createTransporter();

    const mailOptions = {
        from: `"Website Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.CONTACT_RECEIVER_EMAIL,
        replyTo: email,
        subject: `New Contact Form: ${subject}`,
        html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Contact Email Sent Successfully");
        res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        console.error("❌ SMTP Error (Contact):", error.message);
        res.status(500);
        throw new Error(`Email sending failed: ${error.message}`);
    }
});

// POST /api/apply
const sendCareerMail = asyncHandler(async (req, res) => {
    console.log("📩 Received Career Application Submission");
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    const {
        fullName, email, phone, position, location,
        salary, startDate, experience, skills, reason
    } = req.body;

    if (!fullName || !email || !position || !reason) {
        console.warn("⚠️ Career Application: Missing required fields");
        res.status(400);
        throw new Error("Missing required fields (fullName, email, position, reason)");
    }

    const transporter = createTransporter();

    const mailOptions = {
        from: `"Job Application" <${process.env.EMAIL_USER}>`,
        to: process.env.CONTACT_RECEIVER_EMAIL,
        replyTo: email,
        subject: `New Job Application: ${position} - ${fullName}`,
        html: `
      <h3>New Job Application</h3>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Position:</strong> ${position}</p>
      <p><strong>Location:</strong> ${location || 'N/A'}</p>
      <p><strong>Expected Salary:</strong> ${salary || 'N/A'}</p>
      <p><strong>Start Date:</strong> ${startDate || 'N/A'}</p>
      <p><strong>Experience:</strong> ${experience || 'N/A'}</p>
      <p><strong>Skills:</strong> ${skills || 'N/A'}</p>
      <hr />
      <p><strong>Reason for joining:</strong></p>
      <p>${reason.replace(/\n/g, "<br>")}</p>
    `,
    };

    try {
        // We skip verify() to speed up and reduce potential timeout issues if the server is slow
        await transporter.sendMail(mailOptions);
        console.log("✅ Career Application Sent Successfully");
        res.status(200).json({ success: true, message: "Application submitted successfully" });
    } catch (error) {
        console.error("❌ SMTP Error (Career):", error.message);
        res.status(500);
        throw new Error(`Application sending failed: ${error.message}`);
    }
});

module.exports = { sendMail, sendCareerMail };
