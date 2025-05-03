const Event = require('../models/Event');

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single event
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new event
const createEvent = async (req, res) => {
  const event = new Event(req.body);
  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // If this is the Red Bull Nacional España 2025 event, add the Spanish MCs
    if (id === "68102036b36df6bab9426f54") {
      updateData.participants = [
        {
          name: "Gazir",
          imageUrl: "https://cdn.fms.tv/wp-content/uploads/2023/04/gazir-2.png",
          _id: "68150858d50e70dc047ffb2e"
        },
        {
          name: "SKONE",
          imageUrl: "https://cdn.fms.tv/wp-content/uploads/2023/04/skone.png",
          _id: "68150859d50e70dc047ffb30"
        },
        {
          name: "Mnak",
          imageUrl: "https://cdn.fms.tv/wp-content/uploads/2023/04/MNAK_Dist.png",
          _id: "6815085bd50e70dc047ffb32"
        },
        {
          name: "Zasko",
          imageUrl: "https://cdn.fms.tv/wp-content/uploads/2023/04/zasko-dist.png",
          _id: "6815085dd50e70dc047ffb34"
        }
      ];
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({ message: 'Error updating event', error: error.message });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
}; 