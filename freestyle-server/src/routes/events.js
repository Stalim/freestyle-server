const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

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
router.put('/:id', async (req, res) => {
  try {
    const eventUpdate = {
      title: req.body.title,
      date: new Date(req.body.date),
      description: req.body.description,
      location: req.body.location,
      time: req.body.time,
      hosts: req.body.hosts || [],
      djs: req.body.djs || [],
      jury: req.body.jury || [],
      participants: req.body.participants || []
    };

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
router.post('/', async (req, res) => {
  try {
    const event = new Event({
      title: req.body.title,
      date: new Date(req.body.date),
      description: req.body.description,
      location: req.body.location,
      time: req.body.time,
      hosts: req.body.hosts || [],
      djs: req.body.djs || [],
      jury: req.body.jury || [],
      participants: req.body.participants || []
    });

    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 