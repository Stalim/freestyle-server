const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  birthPlace: { type: String, required: true },
  birthDate: { type: String, required: true },
  biography: { type: String, required: true },
  statistics: {
    seasons: { type: String, required: true },
    victories: { type: String, required: true },
    defeats: { type: String, required: true },
    trophies: { type: String, required: true }
  },
  redbullStatistics: {
    battles: { type: String, default: '0' },
    victories: { type: String, default: '0' },
    defeats: { type: String, default: '0' },
    trophies: { type: String, default: '0' }
  },
  leagues: [{ type: String }],
  images: {
    profile: { type: String, required: true },
    logo: { type: String, required: true }
  },
  socialMedia: {
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    tiktok: { type: String, default: '' }
  },
  famousQuotes: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema); 