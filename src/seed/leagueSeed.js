const mongoose = require('mongoose');
const Tabla = require('../models/Tabla');

const leaguesData = [
  {
    name: 'fms_argentina',
    entries: [
      { position: 1, name: 'MECHA', points: 25, bg: 9, bd: 10, bp: 1 },
      { position: 2, name: 'Larrix', points: 22, bg: 7, bd: 10, bp: 3 },
      { position: 3, name: 'Dybbuk', points: 19, bg: 5, bd: 10, bp: 5 },
      { position: 4, name: 'Teorema', points: 19, bg: 6, bd: 10, bp: 4 },
      { position: 5, name: 'Klan', points: 18, bg: 6, bd: 10, bp: 4 },
      { position: 6, name: 'Stuart', points: 18, bg: 6, bd: 10, bp: 4 },
      { position: 7, name: 'Jesse Pungaz', points: 16, bg: 5, bd: 10, bp: 5 },
      { position: 8, name: 'CTZ', points: 8, bg: 3, bd: 10, bp: 7 },
      { position: 9, name: 'Nasir Catriel', points: 6, bg: 2, bd: 10, bp: 8 },
      { position: 10, name: 'Barto', points: 0, bg: 0, bd: 10, bp: 10 }
    ],
    icon: 'fms_argentina'
  },
  {
    name: 'fms_espana',
    entries: [
      { position: 1, name: 'Chuty', matches: 8, points: 21, bg: 7, bd: 1 },
      { position: 2, name: 'Gazir', matches: 8, points: 19, bg: 6, bd: 2 },
      { position: 3, name: 'Sweet Pain', matches: 8, points: 17, bg: 5, bd: 3 },
      { position: 4, name: 'Mnak', matches: 8, points: 15, bg: 4, bd: 4 },
      { position: 5, name: 'Sancer', matches: 8, points: 14, bg: 4, bd: 4 },
      { position: 6, name: 'Zasko', matches: 8, points: 13, bg: 4, bd: 4 },
      { position: 7, name: 'Blon', matches: 8, points: 11, bg: 3, bd: 5 },
      { position: 8, name: 'Sara Socas', matches: 8, points: 10, bg: 3, bd: 5 }
    ],
    icon: 'fms_espana'
  },
  {
    name: 'fms_mexico',
    entries: [
      { position: 1, name: 'Aczino', matches: 8, points: 22, bg: 7, bd: 1 },
      { position: 2, name: 'RC', matches: 8, points: 19, bg: 6, bd: 2 },
      { position: 3, name: 'Rapder', matches: 8, points: 17, bg: 5, bd: 3 },
      { position: 4, name: 'Zticma', matches: 8, points: 15, bg: 4, bd: 4 },
      { position: 5, name: 'Lobo Estepario', matches: 8, points: 14, bg: 4, bd: 4 },
      { position: 6, name: 'Garza', matches: 8, points: 12, bg: 3, bd: 5 },
      { position: 7, name: 'B-One', matches: 8, points: 11, bg: 3, bd: 5 },
      { position: 8, name: 'Yoiker', matches: 8, points: 10, bg: 3, bd: 5 }
    ],
    icon: 'fms_mexico'
  },
  {
    name: 'fms_chile',
    entries: [
      { position: 1, name: 'Teorema', matches: 8, points: 20, bg: 6, bd: 2 },
      { position: 2, name: 'Nitro', matches: 8, points: 18, bg: 5, bd: 3 },
      { position: 3, name: 'Pepe Grillo', matches: 8, points: 16, bg: 5, bd: 3 },
      { position: 4, name: 'Joqerr', matches: 8, points: 15, bg: 4, bd: 4 },
      { position: 5, name: 'Basek', matches: 8, points: 14, bg: 4, bd: 4 },
      { position: 6, name: 'Kaiser', matches: 8, points: 13, bg: 4, bd: 4 },
      { position: 7, name: 'El Menor', matches: 8, points: 12, bg: 3, bd: 5 },
      { position: 8, name: 'Acertijo', matches: 8, points: 10, bg: 3, bd: 5 }
    ],
    icon: 'fms_chile'
  },
  {
    name: 'fms_peru',
    entries: [
      { position: 1, name: 'Jaze', matches: 8, points: 21, bg: 7, bd: 1 },
      { position: 2, name: 'Stick', matches: 8, points: 19, bg: 6, bd: 2 },
      { position: 3, name: 'Nekroos', matches: 8, points: 17, bg: 5, bd: 3 },
      { position: 4, name: 'Ghost', matches: 8, points: 15, bg: 4, bd: 4 },
      { position: 5, name: 'Vijay Kesh', matches: 8, points: 14, bg: 4, bd: 4 },
      { position: 6, name: 'Skill', matches: 8, points: 12, bg: 3, bd: 5 },
      { position: 7, name: 'New Era', matches: 8, points: 11, bg: 3, bd: 5 },
      { position: 8, name: 'Diego MC', matches: 8, points: 9, bg: 2, bd: 6 }
    ],
    icon: 'fms_peru'
  },
  {
    name: 'fms_colombia',
    entries: [
      { position: 1, name: 'Valles-T', matches: 8, points: 20, bg: 6, bd: 2 },
      { position: 2, name: 'Carpediem', matches: 8, points: 18, bg: 5, bd: 3 },
      { position: 3, name: 'Elevation', matches: 8, points: 16, bg: 5, bd: 3 },
      { position: 4, name: 'Fat N', matches: 8, points: 15, bg: 4, bd: 4 },
      { position: 5, name: 'Airon', matches: 8, points: 14, bg: 4, bd: 4 },
      { position: 6, name: 'Filósofo', matches: 8, points: 13, bg: 4, bd: 4 },
      { position: 7, name: 'RBN', matches: 8, points: 11, bg: 3, bd: 5 },
      { position: 8, name: 'Marithea', matches: 8, points: 9, bg: 2, bd: 6 }
    ],
    icon: 'fms_colombia'
  }
];

async function seedLeagues() {
  try {
    // Clear existing data
    await Tabla.deleteMany({});
    console.log('Cleared existing leagues');

    // Insert new data
    const result = await Tabla.insertMany(leaguesData);
    console.log(`Successfully seeded ${result.length} leagues`);

    // Log the names of seeded leagues
    const leagueNames = result.map(league => league.name).join(', ');
    console.log(`Seeded leagues: ${leagueNames}`);

  } catch (error) {
    console.error('Error seeding leagues:', error);
  }
}

// Export the function and data
module.exports = {
  seedLeagues,
  leaguesData
}; 