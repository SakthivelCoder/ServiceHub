const mongoose = require('mongoose');

// Worker Schema for MongoDB
const workerSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true
    },
    aadhaar: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

// Create Worker model
const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;
