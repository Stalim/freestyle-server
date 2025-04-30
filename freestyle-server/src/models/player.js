const mongoose = require('mongoose');

const playerStatsSchema = new mongoose.Schema({
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 }
});

const playerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  bannerUrl: { type: String, required: true },
  age: { type: Number, required: true },
  nationality: { type: String, required: true },
  rapStyle: { type: String, required: true },
  stats: { type: playerStatsSchema, required: true },
  achievements: [{ type: String }],
  description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema); 