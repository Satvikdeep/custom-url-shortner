const express = require('express');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/url');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files (front-end)
app.use(express.static('public'));  // Serve files from 'public' folder
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Connection string used:', process.env.MONGO_URI); // Log the connection string
  });

// Routes
app.use('/url', urlRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;
