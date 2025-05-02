const mongoose = require('mongoose');
const Tabla = require('../models/Tabla');

const MONGODB_URI = 'mongodb://mongo:ZGlGZDZhZmFmNWNkZjY3YmZhMWY4ZjI4@monorail.proxy.rlwy.net:41398';

const fmsArgentinaData = {
    name: 'fms_argentina',
    entries: [
        { position: 1, name: 'Mecha', matches: 10, points: 25, bg: 7, bd: 3 },
        { position: 2, name: 'Larrix', matches: 10, points: 22, bg: 7, bd: 3 },
        { position: 3, name: 'Dybbuk', matches: 10, points: 19, bg: 6, bd: 4 },
        { position: 4, name: 'Teorema', matches: 10, points: 19, bg: 6, bd: 4 },
        { position: 5, name: 'Klan', matches: 10, points: 18, bg: 6, bd: 4 },
        { position: 6, name: 'Stuart', matches: 10, points: 18, bg: 6, bd: 4 },
        { position: 7, name: 'Jesse Pungaz', matches: 10, points: 16, bg: 5, bd: 5 },
        { position: 8, name: 'CTZ', matches: 10, points: 8, bg: 3, bd: 7 },
        { position: 9, name: 'Nasir Catriel', matches: 10, points: 6, bg: 2, bd: 8 },
        { position: 10, name: 'Barto', matches: 10, points: 0, bg: 0, bd: 10 }
    ],
    icon: 'fms_argentina'
};

async function updateFMSArgentina() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // First, try to find and delete the existing document
        await Tabla.deleteOne({ name: 'fms_argentina' });
        console.log('Deleted existing FMS Argentina document');

        // Create a new document with the updated data
        const newLeague = await Tabla.create(fmsArgentinaData);
        console.log(`Created FMS Argentina with ${newLeague.entries.length} entries`);

    } catch (error) {
        console.error('Error updating FMS Argentina:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

updateFMSArgentina(); 