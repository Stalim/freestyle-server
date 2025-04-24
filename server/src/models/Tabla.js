const mongoose = require('mongoose');

const standingEntrySchema = new mongoose.Schema({
  position: { type: Number, required: true },
  name: { type: String, required: true },
  matches: { type: Number, required: true },
  points: { type: Number, required: true }
});

const tablaSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: '' },
  entries: [standingEntrySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
tablaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Tabla', tablaSchema); 