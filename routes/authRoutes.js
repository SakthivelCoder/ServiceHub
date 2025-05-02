// routes/authRoutes.js
const express = require('express');
const { register, verifyEmail, login, joinus } = require('../controllers/authControllers');
const upload = require('../middleware/upload');
const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Email verification route
router.get('/verify/:token', verifyEmail);

// File upload and joinus route
router.post('/joinus', (req, res, next) => {
    upload.single('aadhaar')(req, res, function (err) {
        if (err) {
            return res.status(400).send({ message: err.message });
        }
        next();
    });
}, joinus);

module.exports = router;
