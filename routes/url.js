const express = require('express');
const router = express.Router();
const Url = require('../models/Url');

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