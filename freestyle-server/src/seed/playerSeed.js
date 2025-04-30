require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Player = require('../models/player');

// Sample player data
const playerData = [
  {
    id: 'aczino',
    name: 'Mauricio Hernández (Aczino)',
    imageUrl: 'https://i.imgur.com/JKLmvQP.jpg',
    bannerUrl: 'https://i.imgur.com/8XL4LKj.jpg',
    age: 32,
    nationality: 'México',
    rapStyle: 'Técnico / Punchline',
    stats: {
      wins: 87,
      losses: 12,
      draws: 5,
      winRate: 84
    },
    achievements: [
      'Campeón Internacional Red Bull Batalla 2017',
      'Campeón Internacional Red Bull Batalla 2021',
      'Bicampeón FMS México',
      'Campeón God Level 2vs2 2019',
      'Campeón BDM Deluxe 2018'
    ],
    description: 'Considerado por muchos como el mejor freestyler de la historia, Aczino ha dominado la escena del rap improvisado durante más de una década. Su estilo técnico, flow impecable y capacidad para crear punchlines devastadores lo han convertido en una leyenda viviente. Originario de México, ha conquistado escenarios en todo el mundo hispanohablante.'
  },
  {
    id: 'chuty',
    name: 'Sergio Castro (Chuty)',
    imageUrl: 'https://i.imgur.com/pSGLuY2.jpg',
    bannerUrl: 'https://i.imgur.com/KLbVuHy.jpg',
    age: 34,
    nationality: 'España',
    rapStyle: 'Punchline / Métrica',
    stats: {
      wins: 76,
      losses: 18,
      draws: 8,
      winRate: 75
    },
    achievements: [
      'Campeón Red Bull España 2013 y 2017',
      'Campeón FMS España 2018',
      'Campeón Gold Battle Internacional 2015',
      'Campeón DEM Batalla 2016',
      'Subcampeón Internacional Red Bull 2016'
    ],
    description: 'Chuty es uno de los freestylers más respetados de España y del mundo. Su capacidad para crear rimas complejas y punchlines memorables lo ha llevado a lo más alto de la escena. Con un estilo único que combina técnica, flow y contundencia, ha dejado huella en cada competición en la que ha participado. Su rivalidad con Aczino es legendaria en el mundo del freestyle.'
  },
  {
    id: 'skone',
    name: 'José Miguel Manzano (Skone)',
    imageUrl: 'https://i.imgur.com/L5Qwj3P.jpg',
    bannerUrl: 'https://i.imgur.com/9XYZtHm.jpg',
    age: 34,
    nationality: 'España',
    rapStyle: 'Storytelling / Flow',
    stats: {
      wins: 68,
      losses: 22,
      draws: 10,
      winRate: 68
    },
    achievements: [
      'Campeón Internacional Red Bull Batalla 2016',
      'Campeón FMS España 2017',
      'Campeón Red Bull España 2016',
      'Campeón BDM Deluxe 2015',
      'Campeón God Level 3vs3 2019'
    ],
    description: 'Skone es conocido por su versatilidad y capacidad para adaptarse a cualquier formato de batalla. Su flow melódico y su habilidad para el storytelling lo distinguen de otros competidores. Originario de Málaga, España, ha logrado conquistar los escenarios más importantes del freestyle mundial, incluyendo el campeonato internacional de Red Bull en 2016.'
  },
  {
    id: 'wos',
    name: 'Valentín Oliva (WOS)',
    imageUrl: 'https://i.imgur.com/QZDgcva.jpg',
    bannerUrl: 'https://i.imgur.com/RmBjhT4.jpg',
    age: 26,
    nationality: 'Argentina',
    rapStyle: 'Lírico / Melódico',
    stats: {
      wins: 42,
      losses: 8,
      draws: 4,
      winRate: 78
    },
    achievements: [
      'Campeón Internacional Red Bull Batalla 2018',
      'Campeón Red Bull Argentina 2017',
      'Campeón FMS Argentina 2018',
      'Campeón El Quinto Escalón 2016',
      'Campeón God Level 2vs2 2018'
    ],
    description: 'WOS revolucionó la escena del freestyle argentino con su estilo único que combina lirismo, flow melódico y una actitud desafiante. Tras dominar la escena competitiva, decidió enfocarse en su carrera musical, convirtiéndose en uno de los artistas más exitosos surgidos del mundo del freestyle. Su impacto en la cultura urbana argentina es innegable.'
  },
  {
    id: 'trueno',
    name: 'Mateo Palacios (Trueno)',
    imageUrl: 'https://i.imgur.com/XYZ1234.jpg',
    bannerUrl: 'https://i.imgur.com/ABC5678.jpg',
    age: 22,
    nationality: 'Argentina',
    rapStyle: 'Agresivo / Melódico',
    stats: {
      wins: 35,
      losses: 10,
      draws: 5,
      winRate: 70
    },
    achievements: [
      'Campeón Red Bull Argentina 2019',
      'Campeón God Level 2vs2 2019',
      'Campeón Supremacía MC 2018',
      'Campeón BDM Gold Argentina 2018',
      'Finalista Internacional Red Bull 2019'
    ],
    description: 'Trueno es uno de los talentos más jóvenes que ha dado el freestyle argentino. Desde muy temprana edad demostró un talento natural para la improvisación y las batallas. Su estilo agresivo y su flow versátil lo catapultaron a la fama, y posteriormente ha desarrollado una exitosa carrera musical que lo ha llevado a colaborar con artistas internacionales y llenar estadios en toda Latinoamérica.'
  },
  {
    id: 'bnet',
    name: 'Javier Bonet (Bnet)',
    imageUrl: 'https://i.imgur.com/DEF9012.jpg',
    bannerUrl: 'https://i.imgur.com/GHI3456.jpg',
    age: 27,
    nationality: 'España',
    rapStyle: 'Técnico / Conceptual',
    stats: {
      wins: 52,
      losses: 15,
      draws: 7,
      winRate: 70
    },
    achievements: [
      'Campeón Internacional Red Bull Batalla 2019',
      'Campeón Red Bull España 2018',
      'Campeón FMS España 2019',
      'Campeón Supremacía MC España 2017',
      'Campeón Hipnotik Festival 2018'
    ],
    description: 'Bnet representa la evolución del freestyle moderno. Su estilo técnico, conceptual y reflexivo ha revolucionado la forma de batallar. Con un dominio absoluto de la métrica y una capacidad única para desarrollar conceptos complejos en sus rimas, el madrileño ha dejado una huella indeleble en la escena. Su victoria en la Internacional de Red Bull en 2019 consolidó su lugar entre los grandes del freestyle mundial.'
  },
  {
    id: 'rapder',
    name: 'Eder Lozano (Rapder)',
    imageUrl: 'https://i.imgur.com/JKL7890.jpg',
    bannerUrl: 'https://i.imgur.com/MNO1234.jpg',
    age: 28,
    nationality: 'México',
    rapStyle: 'Punchline / Agresivo',
    stats: {
      wins: 48,
      losses: 16,
      draws: 6,
      winRate: 69
    },
    achievements: [
      'Campeón Internacional Red Bull Batalla 2020',
      'Campeón Red Bull México 2019',
      'Campeón FMS México 2020',
      'Campeón BDM Deluxe México 2018',
      'Campeón God Level 3vs3 2019'
    ],
    description: 'Rapder emergió como una de las figuras más dominantes del freestyle mexicano tras la era de Aczino. Su estilo directo, agresivo y cargado de punchlines efectivos lo llevó a conquistar el campeonato internacional de Red Bull en 2020. Originario de Guadalajara, ha demostrado una evolución constante en su carrera, adaptándose a diferentes formatos y consolidándose como uno de los mejores freestylers del mundo.'
  },
  {
    id: 'gazir',
    name: 'Gabriel Sánchez (Gazir)',
    imageUrl: 'https://i.imgur.com/PQR5678.jpg',
    bannerUrl: 'https://i.imgur.com/STU9012.jpg',
    age: 21,
    nationality: 'España',
    rapStyle: 'Técnico / Doble Tempo',
    stats: {
      wins: 45,
      losses: 10,
      draws: 5,
      winRate: 75
    },
    achievements: [
      'Campeón FMS España 2021',
      'Campeón FMS Internacional 2022',
      'Campeón Red Bull España 2021',
      'Campeón God Level 2vs2 2021',
      'Subcampeón Internacional Red Bull 2021'
    ],
    description: 'Gazir representa la nueva generación del freestyle español. A pesar de su juventud, ha demostrado un dominio técnico excepcional, destacando especialmente en el doble tempo y en las estructuras complejas. Su capacidad para mantener un nivel altísimo de forma consistente lo ha convertido en uno de los competidores más temidos del circuito. Su evolución ha sido meteórica, pasando en pocos años de ser una promesa a convertirse en una realidad indiscutible.'
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Clear existing players
    await Player.deleteMany({});
    console.log('Cleared existing player data');
    
    // Insert new players
    const insertedPlayers = await Player.insertMany(playerData);
    console.log(`Successfully seeded ${insertedPlayers.length} players`);
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding players:', error);
    mongoose.disconnect();
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
}); 