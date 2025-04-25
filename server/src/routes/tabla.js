const express = require('express');
const router = express.Router();
const Tabla = require('../models/Tabla');

// Get all tablas
router.get('/', async (req, res) => {
  try {
    const tablas = await Tabla.find().select('name icon entries createdAt updatedAt');
    // Transform the entries to include bg field
    const transformedTablas = tablas.map(tabla => ({
      ...tabla.toObject(),
      entries: tabla.entries.map(entry => ({
        position: entry.position,
        name: entry.name,
        matches: entry.matches,
        points: entry.points,
        bg: entry.bg || 0 // Include bg field with default 0 if not present
      }))
    }));
    res.json(transformedTablas);
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
    // Transform the entries to include bg field
    const transformedTabla = {
      ...tabla.toObject(),
      entries: tabla.entries.map(entry => ({
        position: entry.position,
        name: entry.name,
        matches: entry.matches,
        points: entry.points,
        bg: entry.bg || 0 // Include bg field with default 0 if not present
      }))
    };
    res.json(transformedTabla);
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
      if (!entry.position || !entry.name || !entry.matches || !entry.points || !entry.bg) {
        return res.status(400).json({ 
          message: 'Each entry must have position, name, matches, points, and bg (batallas ganadas)' 
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

// Update all existing entries with BG field
router.patch('/update-bg', async (req, res) => {
  try {
    const tablas = await Tabla.find();
    
    for (const tabla of tablas) {
      // Update each entry to include BG field if it doesn't exist
      tabla.entries = tabla.entries.map(entry => ({
        ...entry,
        bg: entry.bg || 0
      }));
      
      await tabla.save();
    }
    
    res.json({ 
      message: 'Successfully updated all league entries with BG field',
      updatedCount: tablas.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 