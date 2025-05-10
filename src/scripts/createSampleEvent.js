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

async function createSampleEvent() {
  try {
    const sampleEvent = new Event({
      title: {
        en: "Red Bull Batalla National Final Chile 2025",
        es: "Red Bull Batalla Final Nacional Chile 2025"
      },
      date: new Date('2025-05-10T19:37:00.000Z'),
      description: {
        en: "Chile's best MCs face off in an epic battle for the national title. Don't miss this historic event!",
        es: "Los mejores MCs chilenos se enfrentan en una batalla épica por el título nacional. ¡No te pierdas este evento histórico!"
      },
      location: "Santiago, Chile",
      time: "19:37",
      hosts: ["Host 1", "Host 2"],
      djs: ["DJ 1", "DJ 2"],
      jury: ["Judge 1", "Judge 2", "Judge 3"],
      participants: [
        {
          name: "MC 1",
          imageUrl: "https://example.com/mc1.jpg"
        },
        {
          name: "MC 2",
          imageUrl: "https://example.com/mc2.jpg"
        }
      ]
    });

    const savedEvent = await sampleEvent.save();
    console.log('Sample event created:', savedEvent);
  } catch (error) {
    console.error('Error creating sample event:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
createSampleEvent(); 