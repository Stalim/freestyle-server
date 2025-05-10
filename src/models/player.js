const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
    en: { type: String, required: true },
    es: { type: String, required: true }
});

const nextMatchSchema = new mongoose.Schema({
    id: String,
    opponent: String,
    date: String,
    league: String,
    round: String
}, { _id: false });

const playerSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    birthPlace: { type: String, required: true },
    age: { type: Number, required: true },
    biography: { type: translationSchema, required: true },
    statistics: {
        seasons: { type: String, required: true },
        victories: { type: String, required: true },
        defeats: { type: String, required: true },
        trophies: { type: String, required: true }
    },
    redbullStatistics: {
        battles: { type: String, required: true },
        victories: { type: String, required: true },
        defeats: { type: String, required: true },
        trophies: { type: String, required: true }
    },
    leagues: [{ type: String }],
    images: {
        profile: { type: String, required: true },
        logo: { type: String, required: true }
    },
    socialMedia: {
        twitter: { type: String, default: '' },
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        tiktok: { type: String, default: '' }
    },
    famousQuotes: [{ type: translationSchema }],
    nextMatch: {
        id: { type: String },
        opponent: { type: String },
        date: { type: String },
        league: { type: String },
        round: { type: String }
    }
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);

module.exports = Player; 