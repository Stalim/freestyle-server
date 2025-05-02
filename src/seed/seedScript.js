require('dotenv').config();
const mongoose = require('mongoose');
const { seedLeagues } = require('./leagueSeed');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/freestyle';

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Run the seeding process
    await seedLeagues();
    console.log('Seeding completed successfully');

    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seed function
seed(); 