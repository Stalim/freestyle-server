require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Player = require('../models/player');

const dtokeData = {
  id: 'dtoke',
  name: 'Nicolás Mariano Ruiz (Dtoke)',
  imageUrl: 'https://i.imgur.com/XYZ5678.jpg',
  bannerUrl: 'https://i.imgur.com/ABC1234.jpg',
  age: 36,
  nationality: 'Argentina',
  rapStyle: 'Punchline / Agresivo',
  stats: {
    wins: 65,
    losses: 20,
    draws: 5,
    winRate: 72
  },
  achievements: [
    'Campeón Red Bull Argentina 2013',
    'Campeón Batalla de los Gallos Argentina 2012',
    'Subcampeón Internacional Red Bull 2013',
    'Campeón God Level 2vs2 2018',
    'Campeón Supremacía MC 2016'
  ],
  description: 'Dtoke es uno de los freestylers más respetados de Argentina. Su estilo agresivo y directo, sumado a su capacidad para crear punchlines contundentes, lo han convertido en una leyenda del freestyle latinoamericano. Ha participado en numerosas competiciones internacionales y ha sido mentor de nuevas generaciones de freestylers.'
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Check if player already exists
    const existingPlayer = await Player.findOne({ id: 'dtoke' });
    
    if (existingPlayer) {
      console.log('Dtoke already exists in the database');
      mongoose.disconnect();
      return;
    }
    
    // Create new player
    const newPlayer = new Player(dtokeData);
    await newPlayer.save();
    console.log('Successfully added Dtoke to the database');
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error adding Dtoke:', error);
    mongoose.disconnect();
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
}); 