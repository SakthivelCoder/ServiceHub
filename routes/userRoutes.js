// routes/authRoutes.js
const express = require('express');
const { register, verifyEmail, login } = require('../controllers/authControllers');
const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Email verification route
router.get('/verify/:token', verifyEmail);

module.exports = router;
