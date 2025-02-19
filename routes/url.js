const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const shortid = require('shortid');

router.get('/test-db', async (req, res) => {
    try {
      // Test MongoDB connection by inserting a dummy document
      const testDoc = new Url({ originalUrl: 'https://example.com' });
      await testDoc.save();
      res.status(200).json({ message: 'Database connection successful', doc: testDoc });
    } catch (err) {
      console.error('Database connection error:', err);
      res.status(500).json({ error: 'Database connection failed', details: err.message });
    }
  });
  
// Create Short URL
router.post('/shorten', async (req, res) => {
    const { originalUrl, alias, expiryDate } = req.body;
  
    try {
      // If alias is provided, use it as the short URL
      let shortUrl = alias || shortid.generate(); // Use alias if provided, else generate shortid
  
      // Ensure the alias is unique in the database
      const existingUrl = await Url.findOne({ alias: shortUrl });
      if (existingUrl) {
        return res.status(400).json({ error: 'Alias already taken, please choose a different alias.' });
      }
  
      const url = new Url({ originalUrl, alias: shortUrl, expiryDate });
      await url.save();
      res.status(201).json({ shortUrl: `http://localhost:${process.env.PORT || 3000}/${shortUrl}` }); // Use dynamic PORT
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

// Redirect to Original URL
router.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
  
    try {
      const url = await Url.findOne({ alias: shortUrl }); // Find using alias (shortened URL)
      if (!url) return res.status(404).json({ error: 'URL not found' });
  
      // Update click count and log access
      url.clicks += 1;
      url.accessLogs.push({ timestamp: Date.now() });
      await url.save();
  
      res.redirect(url.originalUrl); // Redirect to the original URL
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
