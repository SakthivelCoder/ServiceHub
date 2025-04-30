const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{10}$/  // Regex for a 10-digit number (adjust if needed)
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null
    },
    tokenExpiry: {
        type: Date,
        default: null
    },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
