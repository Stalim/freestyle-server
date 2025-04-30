const mongoose = require('mongoose');
const Tabla = require('../models/Tabla');

const fmsArgentinaData = {
  name: 'fms_argentina',
  entries: [
    // MECHA: V=7, VR=2, DR=0, D=1
    { position: 1, name: 'MECHA', points: 25, bg: 9, bd: 10, bp: 1 },
    // Larrix: V=7, VR=0, DR=1, D=2
    { position: 2, name: 'Larrix', points: 22, bg: 7, bd: 10, bp: 3 },
    // Dybbuk: V=5, VR=1, DR=2, D=2
    { position: 3, name: 'Dybbuk', points: 19, bg: 6, bd: 10, bp: 4 },
    // Teorema: V=6, VR=0, DR=1, D=3
    { position: 4, name: 'Teorema', points: 19, bg: 6, bd: 10, bp: 4 },
    // Klan: V=5, VR=1, DR=1, D=3
    { position: 5, name: 'Klan', points: 18, bg: 6, bd: 10, bp: 4 },
    // Stuart: V=6, VR=0, DR=0, D=4
    { position: 6, name: 'Stuart', points: 18, bg: 6, bd: 10, bp: 4 },
    // Jesse Pungaz: V=5, VR=0, DR=1, D=4
    { position: 7, name: 'Jesse Pungaz', points: 16, bg: 5, bd: 10, bp: 5 },
    // CTZ: V=2, VR=1, DR=0, D=7
    { position: 8, name: 'CTZ', points: 8, bg: 3, bd: 10, bp: 7 },
    // NASIR CATRIEL: V=2, VR=0, DR=0, D=8
    { position: 9, name: 'NASIR CATRIEL', points: 6, bg: 2, bd: 10, bp: 8 },
    // BARTO: V=0, VR=0, DR=0, D=10
    { position: 10, name: 'BARTO', points: 0, bg: 0, bd: 10, bp: 10 }
  ],
  icon: 'fms_argentina'
};

async function updateFMSArgentina() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://events:lololo0909@events-db.0xqgx.mongodb.net/events-db?retryWrites=true&w=majority');
    console.log('Connected to MongoDB');

    // Update FMS Argentina data
    const result = await Tabla.findOneAndUpdate(
      { name: 'fms_argentina' },
      fmsArgentinaData,
      { new: true, upsert: true }
    );

    console.log('Successfully updated FMS Argentina standings');
    console.log('Updated data:', result);

  } catch (error) {
    console.error('Error updating FMS Argentina:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the update
updateFMSArgentina(); 