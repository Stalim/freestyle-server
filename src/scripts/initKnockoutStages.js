require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const axios = require('axios');

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Sample knockout data for FMS Internacional
const fmsInternacionalKnockout = {
  leagueId: 'fms_internacional',
  title: 'FMS Internacional - Fase Final',
  rounds: [
    {
      name: 'Cuartos de Final',
      matches: [
        {
          id: 'fms_qf_1',
          date: new Date('2023-07-15T18:00:00Z'),
          competitor1: {
            id: 'aczino',
            name: 'Aczino',
            flag: '🇲🇽',
            imageUrl: '/uploads/aczino.jpg'
          },
          competitor2: {
            id: 'skone',
            name: 'Skone',
            flag: '🇪🇸',
            imageUrl: '/uploads/skone.jpg'
          },
          winner: null,
          score1: 0,
          score2: 0
        },
        {
          id: 'fms_qf_2',
          date: new Date('2023-07-15T19:30:00Z'),
          competitor1: {
            id: 'chuty',
            name: 'Chuty',
            flag: '🇪🇸',
            imageUrl: '/uploads/chuty.jpg'
          },
          competitor2: {
            id: 'wos',
            name: 'WOS',
            flag: '🇦🇷',
            imageUrl: '/uploads/wos.jpg'
          },
          winner: null,
          score1: 0,
          score2: 0
        },
        {
          id: 'fms_qf_3',
          date: new Date('2023-07-15T21:00:00Z'),
          competitor1: {
            id: 'dtoke',
            name: 'Dtoke',
            flag: '🇦🇷',
            imageUrl: '/uploads/dtoke.jpg'
          },
          competitor2: {
            id: 'bnet',
            name: 'Bnet',
            flag: '🇪🇸',
            imageUrl: '/uploads/bnet.jpg'
          },
          winner: null,
          score1: 0,
          score2: 0
        },
        {
          id: 'fms_qf_4',
          date: new Date('2023-07-15T22:30:00Z'),
          competitor1: {
            id: 'gazir',
            name: 'Gazir',
            flag: '🇪🇸',
            imageUrl: '/uploads/gazir.jpg'
          },
          competitor2: {
            id: 'kaiser',
            name: 'Kaiser',
            flag: '🇨🇱',
            imageUrl: '/uploads/kaiser.jpg'
          },
          winner: null,
          score1: 0,
          score2: 0
        }
      ]
    },
    {
      name: 'Semifinales',
      matches: [
        {
          id: 'fms_sf_1',
          date: new Date('2023-07-22T19:00:00Z'),
          competitor1: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          competitor2: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          winner: null,
          score1: 0,
          score2: 0
        },
        {
          id: 'fms_sf_2',
          date: new Date('2023-07-22T21:00:00Z'),
          competitor1: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          competitor2: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          winner: null,
          score1: 0,
          score2: 0
        }
      ]
    },
    {
      name: 'Final',
      matches: [
        {
          id: 'fms_final',
          date: new Date('2023-07-29T20:00:00Z'),
          competitor1: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          competitor2: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          winner: null,
          score1: 0,
          score2: 0
        }
      ]
    }
  ],
  currentRound: 0
};

// Sample knockout data for Red Bull Internacional
const redBullInternacionalKnockout = {
  leagueId: 'redbull_internacional',
  title: 'Red Bull Batalla Internacional - Final',
  rounds: [
    {
      name: 'Octavos de Final',
      matches: [
        {
          id: 'rb_of_1',
          date: new Date('2023-08-05T16:00:00Z'),
          competitor1: {
            id: 'aczino',
            name: 'Aczino',
            flag: '🇲🇽',
            imageUrl: '/uploads/aczino.jpg'
          },
          competitor2: {
            id: 'rapder',
            name: 'Rapder',
            flag: '🇲🇽',
            imageUrl: '/uploads/rapder.jpg'
          },
          winner: null,
          score1: 0,
          score2: 0
        },
        {
          id: 'rb_of_2',
          date: new Date('2023-08-05T16:30:00Z'),
          competitor1: {
            id: 'chuty',
            name: 'Chuty',
            flag: '🇪🇸',
            imageUrl: '/uploads/chuty.jpg'
          },
          competitor2: {
            id: 'skone',
            name: 'Skone',
            flag: '🇪🇸',
            imageUrl: '/uploads/skone.jpg'
          },
          winner: null,
          score1: 0,
          score2: 0
        },
        {
          id: 'rb_of_3',
          date: new Date('2023-08-05T17:00:00Z'),
          competitor1: {
            id: 'wos',
            name: 'WOS',
            flag: '🇦🇷',
            imageUrl: '/uploads/wos.jpg'
          },
          competitor2: {
            id: 'papo',
            name: 'Papo',
            flag: '🇦🇷',
            imageUrl: '/uploads/papo.jpg'
          },
          winner: null,
          score1: 0,
          score2: 0
        },
        {
          id: 'rb_of_4',
          date: new Date('2023-08-05T17:30:00Z'),
          competitor1: {
            id: 'dtoke',
            name: 'Dtoke',
            flag: '🇦🇷',
            imageUrl: '/uploads/dtoke.jpg'
          },
          competitor2: {
            id: 'kaiser',
            name: 'Kaiser',
            flag: '🇨🇱',
            imageUrl: '/uploads/kaiser.jpg'
          },
          winner: null,
          score1: 0,
          score2: 0
        },
        {
          id: 'rb_of_5',
          date: new Date('2023-08-05T18:00:00Z'),
          competitor1: {
            id: 'bnet',
            name: 'Bnet',
            flag: '🇪🇸',
            imageUrl: '/uploads/bnet.jpg'
          },
          competitor2: {
            id: 'gazir',
            name: 'Gazir',
            flag: '🇪🇸',
            imageUrl: '/uploads/gazir.jpg'
          },
          winner: null,
          score1: 0,
          score2: 0
        },
        {
          id: 'rb_of_6',
          date: new Date('2023-08-05T18:30:00Z'),
          competitor1: {
            id: 'nekroos',
            name: 'Nekroos',
            flag: '🇵🇪',
            imageUrl: '/uploads/nekroos.jpg'
          },
          competitor2: {
            id: 'jokker',
            name: 'Jokker',
            flag: '🇨🇱',
            imageUrl: '/uploads/jokker.jpg'
          },
          winner: null,
          score1: 0,
          score2: 0
        },
        {
          id: 'rb_of_7',
          date: new Date('2023-08-05T19:00:00Z'),
          competitor1: {
            id: 'valles-t',
            name: 'Valles-T',
            flag: '🇨🇴',
            imageUrl: '/uploads/valles-t.jpg'
          },
          competitor2: {
            id: 'stick',
            name: 'Stick',
            flag: '🇨🇱',
            imageUrl: '/uploads/stick.jpg'
          },
          winner: null,
          score1: 0,
          score2: 0
        },
        {
          id: 'rb_of_8',
          date: new Date('2023-08-05T19:30:00Z'),
          competitor1: {
            id: 'lobo-estepario',
            name: 'Lobo Estepario',
            flag: '🇵🇪',
            imageUrl: '/uploads/lobo-estepario.jpg'
          },
          competitor2: {
            id: 'teorema',
            name: 'Teorema',
            flag: '🇲🇽',
            imageUrl: '/uploads/teorema.jpg'
          },
          winner: null,
          score1: 0,
          score2: 0
        }
      ]
    },
    {
      name: 'Cuartos de Final',
      matches: [
        {
          id: 'rb_qf_1',
          date: new Date('2023-08-12T17:00:00Z'),
          competitor1: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          competitor2: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          winner: null,
          score1: 0,
          score2: 0
        },
        {
          id: 'rb_qf_2',
          date: new Date('2023-08-12T17:45:00Z'),
          competitor1: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          competitor2: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          winner: null,
          score1: 0,
          score2: 0
        },
        {
          id: 'rb_qf_3',
          date: new Date('2023-08-12T18:30:00Z'),
          competitor1: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          competitor2: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          winner: null,
          score1: 0,
          score2: 0
        },
        {
          id: 'rb_qf_4',
          date: new Date('2023-08-12T19:15:00Z'),
          competitor1: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          competitor2: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          winner: null,
          score1: 0,
          score2: 0
        }
      ]
    },
    {
      name: 'Semifinales',
      matches: [
        {
          id: 'rb_sf_1',
          date: new Date('2023-08-19T18:00:00Z'),
          competitor1: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          competitor2: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          winner: null,
          score1: 0,
          score2: 0
        },
        {
          id: 'rb_sf_2',
          date: new Date('2023-08-19T19:00:00Z'),
          competitor1: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          competitor2: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          winner: null,
          score1: 0,
          score2: 0
        }
      ]
    },
    {
      name: 'Final',
      matches: [
        {
          id: 'rb_final',
          date: new Date('2023-08-26T20:00:00Z'),
          competitor1: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          competitor2: {
            id: 'TBD',
            name: 'Por Definir',
            flag: '',
            imageUrl: ''
          },
          winner: null,
          score1: 0,
          score2: 0
        }
      ]
    }
  ],
  currentRound: 0
};

// Function to initialize knockout stages
const initKnockoutStages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('Connected to MongoDB');

    // Initialize FMS Internacional knockout stage
    const fmsResponse = await axios.post(
      `http://localhost:${process.env.PORT || 3001}/api/knockout/fms_internacional`,
      fmsInternacionalKnockout
    );
    console.log('FMS Internacional knockout stage initialized:', fmsResponse.data._id);

    // Initialize Red Bull Internacional knockout stage
    const rbResponse = await axios.post(
      `http://localhost:${process.env.PORT || 3001}/api/knockout/redbull_internacional`,
      redBullInternacionalKnockout
    );
    console.log('Red Bull Internacional knockout stage initialized:', rbResponse.data._id);

    console.log('Knockout stages initialized successfully!');
  } catch (error) {
    console.error('Error initializing knockout stages:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the initialization function
initKnockoutStages(); 