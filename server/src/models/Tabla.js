const mongoose = require('mongoose');

const standingEntrySchema = new mongoose.Schema({
  position: { type: Number, required: true },
  name: { type: String, required: true },
  matches: { type: Number, required: true },
  points: { type: Number, required: true },
  bg: { type: Number, required: true, default: 0 } // Batallas Ganadas
});

const tablaSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: '', required: true },
  entries: [standingEntrySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update the updatedAt timestamp before saving
tablaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Tabla', tablaSchema); 