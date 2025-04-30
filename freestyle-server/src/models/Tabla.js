const mongoose = require('mongoose');

const standingEntrySchema = new mongoose.Schema({
  position: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  matches: {
    type: Number,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  bg: {
    type: Number,
    default: 0
  },
  bp: {
    type: Number,
    default: 0
  }
});

const tablaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  entries: [standingEntrySchema]
});

const Tabla = mongoose.model('Tabla', tablaSchema);

module.exports = Tabla;