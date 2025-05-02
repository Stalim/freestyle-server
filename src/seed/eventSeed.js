const mongoose = require('mongoose');
const Event = require('../models/Event');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://events:lololo0909@events-db.0jqjq.mongodb.net/events-db?retryWrites=true&w=majority';

// Test events data
const eventsData = [
  {
    title: "FMS Argentina - Jornada 1",
    date: "2024-05-01T20:00:00.000Z",
    description: "Primera jornada de la FMS Argentina 2024. No te pierdas las batallas más esperadas de la temporada.",
    location: "Teatro Gran Rex, Buenos Aires",
    time: "20:00",
    imageUrl: "/uploads/fms_argentina_j1.jpg"
  },
  {
    title: "FMS España - Jornada 2",
    date: "2024-05-08T20:00:00.000Z",
    description: "Segunda jornada de la FMS España 2024. Los mejores freestylers de España se enfrentan en una noche llena de rimas.",
    location: "WiZink Center, Madrid",
    time: "20:00",
    imageUrl: "/uploads/fms_espana_j2.jpg"
  },
  {
    title: "FMS México - Jornada 1",
    date: "2024-05-15T19:00:00.000Z",
    description: "Inicio de la FMS México 2024. Aczino y los mejores exponentes del freestyle mexicano en acción.",
    location: "Arena Ciudad de México",
    time: "19:00",
    imageUrl: "/uploads/fms_mexico_j1.jpg"
  }
];

async function seedEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert new events
    const events = await Event.insertMany(eventsData);
    console.log(`Successfully seeded ${events.length} events`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
}

seedEvents(); 