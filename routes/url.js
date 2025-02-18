const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const shortid = require('shortid'); // Ensure shortid is imported

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
    console.log('Request Body:', req.body); // Log the request body

    try {
        // If alias is provided, use it as the short URL
        let shortUrl = alias || shortid.generate(); // Use alias if provided, else generate shortid
        console.log('Generated Short URL:', shortUrl); // Log the generated short URL

        // Ensure the alias is unique in the database
        const existingUrl = await Url.findOne({ alias: shortUrl });
        if (existingUrl) {
            console.log('Alias already exists:', shortUrl); // Log if alias is taken
            return res.status(400).json({ error: 'Alias already taken, please choose a different alias.' });
        }

        // Create and save the URL
        const url = new Url({ originalUrl, alias: shortUrl, expiryDate });
        await url.save();
        console.log('URL saved successfully:', url); // Log the saved URL

        // Respond with the full short URL
        const fullShortUrl = `http://localhost:${process.env.PORT || 3000}/${shortUrl}`;
        console.log('Full Short URL:', fullShortUrl); // Log the full short URL
        res.status(201).json({ shortUrl: fullShortUrl });
    } catch (err) {
        console.error('Error in /shorten:', err); // Log the error
        res.status(400).json({ error: err.message });
    }
});

// Redirect to Original URL
router.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
    console.log('Requested Short URL:', shortUrl); // Log the requested short URL

    try {
        const url = await Url.findOne({ alias: shortUrl }); // Find using alias (shortened URL)
        if (!url) {
            console.log('URL not found:', shortUrl); // Log if URL is not found
            return res.status(404).json({ error: 'URL not found' });
        }

        // Update click count and log access
        url.clicks += 1;
        url.accessLogs.push({ timestamp: Date.now() });
        await url.save();
        console.log('URL accessed:', url); // Log the accessed URL

        res.redirect(url.originalUrl); // Redirect to the original URL
    } catch (err) {
        console.error('Error in /:shortUrl:', err); // Log the error
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
