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
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/url', urlRoutes);

// Serve index.html at the root path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
