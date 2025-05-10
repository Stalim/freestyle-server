const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    
    // Get language from query parameter, default to 'es'
    const lang = req.query.lang || 'es';
    
    // Transform events to include only the requested language
    const transformedEvents = events.map(event => ({
      _id: event._id,
      title: event.title[lang],
      date: event.date,
      description: event.description[lang],
      location: event.location,
      time: event.time,
      hosts: event.hosts,
      djs: event.djs,
      jury: event.jury,
      participants: event.participants,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      __v: event.__v
    }));
    
    res.json(transformedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      // Get language from query parameter, default to 'es'
      const lang = req.query.lang || 'es';
      
      // Transform event to include only the requested language
      const transformedEvent = {
        _id: event._id,
        title: event.title[lang],
        date: event.date,
        description: event.description[lang],
        location: event.location,
        time: event.time,
        hosts: event.hosts,
        djs: event.djs,
        jury: event.jury,
        participants: event.participants,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        __v: event.__v
      };
      
      res.json(transformedEvent);
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
      title: {
        en: req.body.title_en || req.body.title,
        es: req.body.title_es || req.body.title
      },
      date: new Date(req.body.date),
      description: {
        en: req.body.description_en || req.body.description,
        es: req.body.description_es || req.body.description
      },
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
      // Get language from query parameter, default to 'es'
      const lang = req.query.lang || 'es';
      
      // Transform event to include only the requested language
      const transformedEvent = {
        _id: updatedEvent._id,
        title: updatedEvent.title[lang],
        date: updatedEvent.date,
        description: updatedEvent.description[lang],
        location: updatedEvent.location,
        time: updatedEvent.time,
        hosts: updatedEvent.hosts,
        djs: updatedEvent.djs,
        jury: updatedEvent.jury,
        participants: updatedEvent.participants,
        createdAt: updatedEvent.createdAt,
        updatedAt: updatedEvent.updatedAt,
        __v: updatedEvent.__v
      };
      
      res.json(transformedEvent);
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
      title: {
        en: req.body.title_en || req.body.title,
        es: req.body.title_es || req.body.title
      },
      date: new Date(req.body.date),
      description: {
        en: req.body.description_en || req.body.description,
        es: req.body.description_es || req.body.description
      },
      location: req.body.location,
      time: req.body.time,
      hosts: req.body.hosts || [],
      djs: req.body.djs || [],
      jury: req.body.jury || [],
      participants: req.body.participants || []
    });

    const newEvent = await event.save();
    
    // Get language from query parameter, default to 'es'
    const lang = req.query.lang || 'es';
    
    // Transform event to include only the requested language
    const transformedEvent = {
      _id: newEvent._id,
      title: newEvent.title[lang],
      date: newEvent.date,
      description: newEvent.description[lang],
      location: newEvent.location,
      time: newEvent.time,
      hosts: newEvent.hosts,
      djs: newEvent.djs,
      jury: newEvent.jury,
      participants: newEvent.participants,
      createdAt: newEvent.createdAt,
      updatedAt: newEvent.updatedAt,
      __v: newEvent.__v
    };
    
    res.status(201).json(transformedEvent);
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