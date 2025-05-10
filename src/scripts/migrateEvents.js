const mongoose = require('mongoose');
const Event = require('../models/Event');

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freestyle', mongooseOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function migrateEvents() {
  try {
    // Get all events
    const events = await Event.find();
    console.log(`Found ${events.length} events to migrate`);

    // Update each event
    for (const event of events) {
      // Create translations object
      const update = {
        title: {
          en: event.title || 'Event Title', // Use existing title as English version
          es: event.title || 'Título del Evento' // Use existing title as Spanish version
        },
        description: {
          en: event.description || 'Event Description', // Use existing description as English version
          es: event.description || 'Descripción del Evento' // Use existing description as Spanish version
        }
      };

      // Update the event
      await Event.findByIdAndUpdate(event._id, update);
      console.log(`Migrated event: ${event._id}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the migration
migrateEvents(); 