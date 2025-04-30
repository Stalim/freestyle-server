const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
    return cb(null, true);
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
      return res.status(400).json({ message: 'Wrong field name for file upload. Use "profileImage" and "bannerImage" fields.' });
    }
    return res.status(400).json({ message: `Multer error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// GET all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Error fetching players', error: error.message });
  }
});

// Debug route to check if a player exists
router.get('/debug/:id', async (req, res) => {
  try {
    const playerId = req.params.id;
    console.log('Debug: Checking if player exists with ID:', playerId);
    
    // Check if player exists in database
    const player = await Player.findOne({ id: playerId });
    
    if (player) {
      console.log('Debug: Player found:', player.name);
      res.json({ 
        exists: true, 
        player: { 
          id: player.id, 
          name: player.name 
        } 
      });
    } else {
      console.log('Debug: Player not found with ID:', playerId);
      
      // List all player IDs in the database
      const allPlayers = await Player.find({}, 'id name');
      const playerIds = allPlayers.map(p => p.id);
      
      res.status(404).json({ 
        exists: false, 
        message: 'Player not found', 
        searchedId: playerId,
        availableIds: playerIds
      });
    }
  } catch (error) {
    console.error('Debug: Error checking player:', error);
    res.status(500).json({ message: 'Error checking player', error: error.message });
  }
});

// GET a specific player by ID
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching player with ID:', req.params.id);
    const player = await Player.findOne({ id: req.params.id });
    if (!player) {
      console.log('Player not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Player not found' });
    }
    console.log('Player found:', player.name);
    res.json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ message: 'Error fetching player', error: error.message });
  }
});

// POST a new player with file uploads
router.post('/', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 }
]), handleMulterError, async (req, res) => {
  try {
    const playerData = JSON.parse(req.body.playerData || '{}');
    
    // Add image URLs if files were uploaded
    if (req.files) {
      if (req.files.profileImage && req.files.profileImage[0]) {
        playerData.imageUrl = `/uploads/${req.files.profileImage[0].filename}`;
      }
      
      if (req.files.bannerImage && req.files.bannerImage[0]) {
        playerData.bannerUrl = `/uploads/${req.files.bannerImage[0].filename}`;
      }
    }
    
    const newPlayer = new Player(playerData);
    const savedPlayer = await newPlayer.save();
    res.status(201).json(savedPlayer);
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(400).json({ message: 'Error creating player', error: error.message });
  }
});

// PUT (update) a player with file uploads
router.put('/:id', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 }
]), handleMulterError, async (req, res) => {
  try {
    const playerData = JSON.parse(req.body.playerData || '{}');
    
    // Add image URLs if files were uploaded
    if (req.files) {
      if (req.files.profileImage && req.files.profileImage[0]) {
        playerData.imageUrl = `/uploads/${req.files.profileImage[0].filename}`;
      }
      
      if (req.files.bannerImage && req.files.bannerImage[0]) {
        playerData.bannerUrl = `/uploads/${req.files.bannerImage[0].filename}`;
      }
    }
    
    const updatedPlayer = await Player.findOneAndUpdate(
      { id: req.params.id },
      playerData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPlayer) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    res.json(updatedPlayer);
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(400).json({ message: 'Error updating player', error: error.message });
  }
});

// DELETE a player
router.delete('/:id', async (req, res) => {
  try {
    const deletedPlayer = await Player.findOneAndDelete({ id: req.params.id });
    
    if (!deletedPlayer) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ message: 'Error deleting player', error: error.message });
  }
});

module.exports = router; 