const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const workerRoutes = require('./routes/workerRoutes');
const cors = require('cors');
const path = require('path');
const app = express();
dotenv.config();


// CORS configuration
app.use(cors());

// Rest of your Express app setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// Connect to DB
connectDB();

// Routes
app.use('/user', userRoutes);
app.use('/worker', workerRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://127.0.0.1:${PORT}`);
});
