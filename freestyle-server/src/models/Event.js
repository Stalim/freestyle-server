const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  hosts: [{
    type: String,
    required: true,
    trim: true
  }],
  djs: [{
    type: String,
    required: true,
    trim: true
  }],
  jury: [{
    type: String,
    required: true,
    trim: true
  }],
  participants: [participantSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema); 