const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Event = require('../models/Event');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Add timestamp to filename to make it unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'));
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Wrong field name for file upload. Use "imageFile" field.' });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update event
router.put('/:id', upload.single('imageFile'), handleMulterError, async (req, res) => {
  try {
    const eventUpdate = {
      title: req.body.title,
      date: new Date(req.body.date),
      description: req.body.description,
      location: req.body.location,
      time: req.body.time
    };

    // If a new image was uploaded, update the imageUrl
    if (req.file) {
      eventUpdate.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      eventUpdate,
      { new: true, runValidators: true }
    );

    if (updatedEvent) {
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create new event
router.post('/', upload.single('imageFile'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const event = new Event({
      title: req.body.title,
      date: new Date(req.body.date),
      description: req.body.description,
      location: req.body.location,
      time: req.body.time,
      imageUrl: `/uploads/${req.file.filename}`
    });

    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 