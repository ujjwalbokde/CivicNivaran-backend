const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/dbConnect');
const cors = require('cors');
const path = require('path');
const app = express();
dotenv.config();
//Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
connectDB();

//Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});