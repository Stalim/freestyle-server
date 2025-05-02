const express = require('express');
const router = express.Router();
const Tabla = require('../models/Tabla');

// Helper function to clean entry data
const cleanEntry = (entry) => ({
  position: entry.position,
  name: entry.name,
  matches: entry.matches,
  points: entry.points,
  bg: entry.bg || 0,
  bp: entry.bp || 0,
  _id: entry._id.toString()
});

// Helper function to clean tabla data
const cleanTabla = (tabla) => ({
  name: tabla.name,
  entries: tabla.entries.map(cleanEntry)
});

// Get all tablas
router.get('/', async (req, res) => {
  try {
    const tablas = await Tabla.find().lean();
    const response = {};
    
    tablas.forEach(tabla => {
      response[tabla.name] = tabla.entries.map(entry => ({
        _id: entry._id.toString(),
        position: entry.position,
        name: entry.name,
        matches: entry.matches,
        points: entry.points,
        bg: entry.bg || 0,
        bp: entry.bp || 0
      }));
    });
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a tabla by name
router.delete('/name/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const tabla = await Tabla.findOne({ name });
    
    if (!tabla) {
      return res.status(404).json({ message: 'Tabla not found' });
    }
    
    await Tabla.deleteOne({ name });
    res.json({ message: 'Tabla deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific tabla by name
router.get('/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const tabla = await Tabla.findOne({ name });
        
        if (!tabla) {
            return res.status(404).json({ message: 'Tabla not found' });
        }

        res.json(cleanTabla(tabla));
    } catch (error) {
        console.error('Error getting tabla:', error);
        res.status(500).json({ message: 'Error getting tabla', error: error.message });
    }
});

// Create a new tabla
router.post('/', async (req, res) => {
  try {
    const newTabla = new Tabla({
      ...req.body,
      entries: req.body.entries.map(entry => ({
        ...entry,
        bg: entry.bg || 0,
        bp: entry.bp || 0
      }))
    });
    const savedTabla = await newTabla.save();
    res.status(201).json(cleanTabla(savedTabla));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a tabla by name
router.put('/:name', async (req, res) => {
  try {
    const tabla = await Tabla.findOne({ name: req.params.name });
    if (!tabla) {
      return res.status(404).json({ message: 'Tabla not found' });
    }

    tabla.entries = req.body.entries.map(entry => ({
      ...entry,
      bg: entry.bg || 0,
      bp: entry.bp || 0
    }));

    const updatedTabla = await tabla.save();
    res.json(cleanTabla(updatedTabla));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a specific entry in a tabla
router.patch('/:id/entries/:entryId', async (req, res) => {
  try {
    const tabla = await Tabla.findById(req.params.id);
    if (!tabla) {
      return res.status(404).json({ message: 'Tabla not found' });
    }

    const entryIndex = tabla.entries.findIndex(
      entry => entry._id.toString() === req.params.entryId
    );
    if (entryIndex === -1) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    tabla.entries[entryIndex] = {
      ...tabla.entries[entryIndex].toObject(),
      ...req.body,
      bg: req.body.bg || tabla.entries[entryIndex].bg || 0,
      bp: req.body.bp || tabla.entries[entryIndex].bp || 0
    };

    const updatedTabla = await tabla.save();
    res.json(cleanTabla(updatedTabla));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 