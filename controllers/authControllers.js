const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Worker = require('../models/worker');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodeMailer = require('nodemailer');
const path = require('path');
const twilio = require('twilio');
const crypto = require('crypto');
dotenv.config();
// URLs for frontend and backend
const frontendUrl = process.env.FRONTEND_URL;
const backendUrl = process.env.BACKEND_URL;

// Nodemailer transporter configuration
const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// User Registration
const register = async (req, res) => {
    try {
        const { name, email, phone, address, password } = req.body;
        console.log("Received:", req.body);

        if (!name?.trim() || !email?.trim() || !phone?.trim() || !address?.trim() || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Assuming you have a User model to save to the database
        const pass = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 3600000; // 1 hour from now
        const newUser = await User.create({ name, email, phone, address, password: pass, verificationToken, tokenExpiry });
        console.log("New User:", newUser);
        const verificationLink = `${frontendUrl}/verify.html?token=${verificationToken}`;
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_MAIL}>`,
            to: email,
            subject: 'Email Verification',
            html: `<p>Welcome, ${name}!</p>
                <p>To complete your registration, please verify your email by clicking the link below:</p>
                <a href="${verificationLink}">Verify Email</a>`
        };
        await transporter.sendMail(mailOptions);

        if (!newUser) {
            return res.status(400).json({ success: true, message: "User not created" });
        }
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

// Email Verification
const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({
            verificationToken: token,
            tokenExpiry: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.tokenExpiry = undefined;
        await user.save();
        res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error verifying email', error: error.message });
    }
};

// User Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ success: true, message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Worker Registration
const workerReg = async (req, res) => {
    try {
        const { name, email, phone, address, profession } = req.body;
        const aadhaarFile = req.file?.path;
        console.log("Received:", req.body);

        if (!name?.trim() || !email?.trim() || !phone?.trim() || !address?.trim() || !profession || !aadhaarFile) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Generate a random password
        const generatePassword = (length = 16) => {
            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
            let password = "";
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * chars.length);
                password += chars[randomIndex];
            }
            return password;
        };
        const raw_pass = generatePassword();

        // Hash the password
        const hash_pass = await bcrypt.hash(raw_pass, 10);
        const newWorker = await Worker.create({ name, email, phone, address, password: hash_pass, profession, aadhaar: aadhaarFile });
        console.log("New Worker:", newWorker);
        const approvalLink = `${backendUrl}/approve/${newWorker._id}`;

        // Send WhatsApp notification to admin with Aadhaar file URL and approval link
        const aadhaarFilename = path.basename(aadhaarFile);
        const aadhaarFileUrl = `${frontendUrl}/uploads/${aadhaarFilename}`;
        // Send WhatsApp notification
        await sendWhatsAppNotification(newWorker, approvalLink, aadhaarFileUrl, raw_pass);
        if (!newWorker) {
            return res.status(400).json({ success: true, message: "User not created" });
        }
        res.status(201).json({ message: "Worker created successfully", user: newWorker });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

// Send WhatsApp message
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
async function sendWhatsAppNotification(workerData, approvalLink, aadhaarFileUrl, raw_pass) {
    const message = `
    *New Worker Registered:*
    👤 *Name*: ${workerData.name}
    📧 *Email*: ${workerData.email}
    📞 *Phone*: ${workerData.phone}
    🆔 *Password*: ${raw_pass}
    🔧 *Profession*: ${workerData.profession}
    🆔 *Aadhaar*: ${aadhaarFileUrl}
    ✅ *Approval Link*: ${approvalLink}
    `;
    try {
        const response = await client.messages.create({
            body: message,
            // Twilio WhatsApp sandbox number
            from: `whatsapp:${process.env.TWILIO_PHONE}`,
            to: `whatsapp:${process.env.ADMIN_WHATSAPP}` // Admin WhatsApp number
        });
        console.log("Message sent successfully", response);
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// Exporting the functions
module.exports = { register, verifyEmail, login, workerReg };
