const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://alimrm2022:alimrm2022@cluster0.8jqgq.mongodb.net/events-db?retryWrites=true&w=majority';

// Event Schema
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    titleTranslations: {
        en: { type: String, trim: true },
        es: { type: String, trim: true }
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    descriptionTranslations: {
        en: { type: String },
        es: { type: String }
    },
    location: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    hosts: [{
        type: String,
        required: true,
        trim: true
    }],
    djs: [{
        type: String,
        required: true,
        trim: true
    }],
    jury: [{
        type: String,
        required: true,
        trim: true
    }],
    participants: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        imageUrl: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

async function createSampleEvent() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10,
            minPoolSize: 5,
            connectTimeoutMS: 10000
        });
        console.log('Connected to MongoDB successfully!');

        const sampleEvent = new Event({
            title: 'Red Bull Batalla Final Nacional Chile 2025',
            titleTranslations: {
                en: 'Red Bull Battle National Final Chile 2025',
                es: 'Red Bull Batalla Final Nacional Chile 2025'
            },
            date: new Date('2025-12-15'),
            description: 'La gran final nacional de Red Bull Batalla de los Gallos en Chile. Los mejores MCs del país se enfrentarán por el título nacional y el pase a la final internacional.',
            descriptionTranslations: {
                en: 'The national grand final of Red Bull Battle of the Roosters in Chile. The best MCs in the country will face off for the national title and a spot in the international final.',
                es: 'La gran final nacional de Red Bull Batalla de los Gallos en Chile. Los mejores MCs del país se enfrentarán por el título nacional y el pase a la final internacional.'
            },
            location: 'Movistar Arena, Santiago',
            time: '19:00',
            hosts: ['Gazir', 'Tirpa'],
            djs: ['DJ Scuff', 'DJ Sonicko'],
            jury: ['Aczino', 'Trueno', 'Wos'],
            participants: [
                {
                    name: 'MC 1',
                    imageUrl: 'https://example.com/mc1.jpg'
                },
                {
                    name: 'MC 2',
                    imageUrl: 'https://example.com/mc2.jpg'
                }
            ]
        });

        const savedEvent = await sampleEvent.save();
        console.log('Sample event created:', savedEvent);
    } catch (error) {
        console.error('Error creating sample event:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

createSampleEvent(); 