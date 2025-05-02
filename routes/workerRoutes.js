// routes/authRoutes.js
const express = require('express');
const { workerReg } = require('../controllers/authControllers');
const upload = require('../middleware/upload');
const router = express.Router();

// File upload and joinus route
router.post('/joinus', (req, res, next) => {
    upload.single('aadhaar')(req, res, function (err) {
        if (err) {
            return res.status(400).send({ message: err.message });
        }
        next();
    });
}, workerReg);

module.exports = router;
