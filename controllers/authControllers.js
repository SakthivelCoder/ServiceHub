const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodeMailer = require('nodemailer');
const crypto = require('crypto');
dotenv.config();

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

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
        const verificationLink = `http://localhost:5500/verify.html?token=${verificationToken}`;
        const mailOptions = {
            from: '"No Reply" <no-reply@servicehub.com',
            to: email,
            subject: 'Email Verification',
            html: `<p>Welcome, ${name}!</p>
                <p>To complete your registration, please verify your email by clicking the link below:</p>
                <a href="${verificationLink}">Verify Email</a>`
        };
        await transporter.sendMail(mailOptions);
        
        if (!newUser) {
            return res.status(400).json({ message: "User not created" });
        }
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await  User.findOne({ 
            verificationToken: token, 
            tokenExpiry: { $gt: Date.now()}
            } );
        if (!user) {
            return res.status(400).json({ success:false , message: 'Invalid or expired token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.tokenExpiry = undefined;
        await user.save();
        res.status(200).json({ success:true, message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success:false, message: 'Error verifying email', error: error.message });
    }};


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

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};


module.exports = { register, verifyEmail, login };
