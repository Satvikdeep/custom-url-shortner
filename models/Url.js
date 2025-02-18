const mongoose = require('mongoose');
const shortid = require('shortid');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, default: shortid.generate },
  alias: { type: String, unique: true },
  expiryDate: { type: Date },
  clicks: { type: Number, default: 0 },
  accessLogs: [{ timestamp: { type: Date, default: Date.now } }]
});

module.exports = mongoose.model('Url', urlSchema);