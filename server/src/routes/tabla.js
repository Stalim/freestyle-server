const express = require('express');
const router = express.Router();
const Tabla = require('../models/Tabla');

// Get all tablas
router.get('/', async (req, res) => {
  try {
    const tablas = await Tabla.find().select('name icon entries createdAt updatedAt');
    res.json(tablas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific tabla by name
router.get('/:name', async (req, res) => {
  try {
    const tabla = await Tabla.findOne({ name: req.params.name }).select('name icon entries createdAt updatedAt');
    if (!tabla) {
      return res.status(404).json({ message: 'Tabla not found' });
    }
    res.json(tabla);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update a tabla
router.post('/', async (req, res) => {
  try {
    const { name, entries, icon } = req.body;

    if (!name || !entries || !Array.isArray(entries)) {
      return res.status(400).json({ message: 'Name and entries array are required' });
    }

    // Validate entries format
    for (const entry of entries) {
      if (!entry.position || !entry.name || !entry.matches || !entry.points) {
        return res.status(400).json({ 
          message: 'Each entry must have position, name, matches, and points' 
        });
      }
    }

    // Sort entries by position
    const sortedEntries = entries.sort((a, b) => a.position - b.position);

    // Try to update existing tabla, if not create new one
    const result = await Tabla.findOneAndUpdate(
      { name },
      { 
        name,
        icon: icon || '', // Add icon field with default empty string
        entries: sortedEntries,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    ).select('name icon entries createdAt updatedAt');

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a tabla
router.delete('/:name', async (req, res) => {
  try {
    const tabla = await Tabla.findOneAndDelete({ name: req.params.name });
    if (!tabla) {
      return res.status(404).json({ message: 'Tabla not found' });
    }
    res.json({ message: 'Tabla deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 