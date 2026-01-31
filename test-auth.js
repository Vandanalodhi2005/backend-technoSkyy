require('dotenv').config();
const nodemailer = require('nodemailer');

console.log("--- SMTP Auth Test (Port 587) ---");
console.log("Host:", process.env.EMAIL_HOST);
console.log("User:", process.env.EMAIL_USER);
console.log("Port:", process.env.EMAIL_PORT);
console.log("---------------------------------");

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

transporter.verify((error, success) => {
    if (error) {
        console.error("❌ FAILED: Connection was rejected.");
        console.error("Error Detail:", error.message);
    } else {
        console.log("✅ SUCCESS: Port 587 is working perfectly!");
    }
});
