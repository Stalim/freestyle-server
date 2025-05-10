const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
  try {
    const lang = req.query.lang || 'es'; // Default to Spanish if no language specified
    const events = await Event.find().sort({ date: 1 });
    
    // Transform events to include translations
    const translatedEvents = events.map(event => {
      const eventObj = event.toObject();
      // Safely handle missing translation fields
      eventObj.titleTranslations = eventObj.titleTranslations || {};
      eventObj.descriptionTranslations = eventObj.descriptionTranslations || {};
      
      // Set the title and description based on the requested language, fallback to original if missing
      const titleTranslation = eventObj.titleTranslations[lang];
      const descriptionTranslation = eventObj.descriptionTranslations[lang];
      
      // Add warning if translation is missing
      if (!titleTranslation) {
        console.warn(`Missing ${lang} translation for event title: ${eventObj.title}`);
      }
      if (!descriptionTranslation) {
        console.warn(`Missing ${lang} translation for event description: ${eventObj.description}`);
      }
      
      eventObj.title = titleTranslation || eventObj.title || '';
      eventObj.description = descriptionTranslation || eventObj.description || '';
      
      // Add translation status to response
      eventObj.translationStatus = {
        title: {
          hasTranslation: !!titleTranslation,
          language: lang
        },
        description: {
          hasTranslation: !!descriptionTranslation,
          language: lang
        }
      };
      
      return eventObj;
    });
    
    res.json(translatedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const lang = req.query.lang || 'es'; // Default to Spanish if no language specified
    const event = await Event.findById(req.params.id);
    if (event) {
      const eventObj = event.toObject();
      // Safely handle missing translation fields
      eventObj.titleTranslations = eventObj.titleTranslations || {};
      eventObj.descriptionTranslations = eventObj.descriptionTranslations || {};
      
      // Set the title and description based on the requested language, fallback to original if missing
      const titleTranslation = eventObj.titleTranslations[lang];
      const descriptionTranslation = eventObj.descriptionTranslations[lang];
      
      // Add warning if translation is missing
      if (!titleTranslation) {
        console.warn(`Missing ${lang} translation for event title: ${eventObj.title}`);
      }
      if (!descriptionTranslation) {
        console.warn(`Missing ${lang} translation for event description: ${eventObj.description}`);
      }
      
      eventObj.title = titleTranslation || eventObj.title || '';
      eventObj.description = descriptionTranslation || eventObj.description || '';
      
      // Add translation status to response
      eventObj.translationStatus = {
        title: {
          hasTranslation: !!titleTranslation,
          language: lang
        },
        description: {
          hasTranslation: !!descriptionTranslation,
          language: lang
        }
      };
      
      res.json(eventObj);
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
      titleTranslations: req.body.titleTranslations,
      date: new Date(req.body.date),
      description: req.body.description,
      descriptionTranslations: req.body.descriptionTranslations,
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
      titleTranslations: req.body.titleTranslations,
      date: new Date(req.body.date),
      description: req.body.description,
      descriptionTranslations: req.body.descriptionTranslations,
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