require('dotenv').config({ path: '../../.env' });
const axios = require('axios');

// Base URL for API requests
const API_BASE_URL = 'http://localhost:3001/api/knockout';

// Leagues to check
const leagueIds = ['fms_internacional', 'redbull_internacional', 'rdi'];

// Minimal knockout data templates
const knockoutTemplates = {
  'fms_internacional': {
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
              flag: '🇲🇽'
            },
            competitor2: {
              id: 'skone',
              name: 'Skone',
              flag: '🇪🇸'
            }
          },
          {
            id: 'fms_qf_2',
            date: new Date('2023-07-15T19:30:00Z'),
            competitor1: {
              id: 'chuty',
              name: 'Chuty',
              flag: '🇪🇸'
            },
            competitor2: {
              id: 'wos',
              name: 'WOS',
              flag: '🇦🇷'
            }
          },
          {
            id: 'fms_qf_3',
            date: new Date('2023-07-15T21:00:00Z'),
            competitor1: {
              id: 'dtoke',
              name: 'Dtoke',
              flag: '🇦🇷'
            },
            competitor2: {
              id: 'bnet',
              name: 'Bnet',
              flag: '🇪🇸'
            }
          },
          {
            id: 'fms_qf_4',
            date: new Date('2023-07-15T22:30:00Z'),
            competitor1: {
              id: 'gazir',
              name: 'Gazir',
              flag: '🇪🇸'
            },
            competitor2: {
              id: 'kaiser',
              name: 'Kaiser',
              flag: '🇨🇱'
            }
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
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            },
            competitor2: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            }
          },
          {
            id: 'fms_sf_2',
            date: new Date('2023-07-22T21:00:00Z'),
            competitor1: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            },
            competitor2: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            }
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
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            },
            competitor2: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            }
          }
        ]
      }
    ]
  },
  'redbull_internacional': {
    leagueId: 'redbull_internacional',
    title: 'Red Bull Batalla Internacional - Final',
    rounds: [
      {
        name: 'Cuartos de Final',
        matches: [
          {
            id: 'rb_qf_1',
            date: new Date('2023-08-05T16:00:00Z'),
            competitor1: {
              id: 'aczino',
              name: 'Aczino',
              flag: '🇲🇽'
            },
            competitor2: {
              id: 'rapder',
              name: 'Rapder',
              flag: '🇲🇽'
            }
          },
          {
            id: 'rb_qf_2',
            date: new Date('2023-08-05T16:30:00Z'),
            competitor1: {
              id: 'chuty',
              name: 'Chuty',
              flag: '🇪🇸'
            },
            competitor2: {
              id: 'skone',
              name: 'Skone',
              flag: '🇪🇸'
            }
          },
          {
            id: 'rb_qf_3',
            date: new Date('2023-08-05T17:00:00Z'),
            competitor1: {
              id: 'sweet-pain',
              name: 'Sweet Pain',
              flag: '🇪🇸'
            },
            competitor2: {
              id: 'mnak',
              name: 'Mnak',
              flag: '🇨🇱'
            }
          },
          {
            id: 'rb_qf_4',
            date: new Date('2023-08-05T17:30:00Z'),
            competitor1: {
              id: 'gazir',
              name: 'Gazir',
              flag: '🇪🇸'
            },
            competitor2: {
              id: 'nitro',
              name: 'Nitro',
              flag: '🇨🇱'
            }
          }
        ]
      },
      {
        name: 'Semifinales',
        matches: [
          {
            id: 'rb_sf_1',
            date: new Date('2023-08-12T17:00:00Z'),
            competitor1: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            },
            competitor2: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            }
          },
          {
            id: 'rb_sf_2',
            date: new Date('2023-08-12T18:00:00Z'),
            competitor1: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            },
            competitor2: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            }
          }
        ]
      },
      {
        name: 'Final',
        matches: [
          {
            id: 'rb_final',
            date: new Date('2023-08-19T20:00:00Z'),
            competitor1: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            },
            competitor2: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            }
          }
        ]
      }
    ]
  },
  'rdi': {
    leagueId: 'rdi',
    title: 'Red Bull Dominicana Internacional',
    rounds: [
      {
        name: 'Cuartos de Final',
        matches: [
          {
            id: 'rdi_qf_1',
            date: new Date('2023-09-10T18:00:00Z'),
            competitor1: {
              id: 'yartzi',
              name: 'Yartzi',
              flag: '🇵🇷'
            },
            competitor2: {
              id: 'elevn',
              name: 'Elevn',
              flag: '🇩🇴'
            }
          },
          {
            id: 'rdi_qf_2',
            date: new Date('2023-09-10T19:00:00Z'),
            competitor1: {
              id: 'valles-t',
              name: 'Valles-T',
              flag: '🇨🇴'
            },
            competitor2: {
              id: 'shadow',
              name: 'Shadow',
              flag: '🇩🇴'
            }
          },
          {
            id: 'rdi_qf_3',
            date: new Date('2023-09-10T20:00:00Z'),
            competitor1: {
              id: 'letra',
              name: 'Letra',
              flag: '🇲🇽'
            },
            competitor2: {
              id: 'jaze',
              name: 'Jaze',
              flag: '🇵🇪'
            }
          },
          {
            id: 'rdi_qf_4',
            date: new Date('2023-09-10T21:00:00Z'),
            competitor1: {
              id: 'nitro',
              name: 'Nitro',
              flag: '🇨🇱'
            },
            competitor2: {
              id: 'stick',
              name: 'Stick',
              flag: '🇨🇱'
            }
          }
        ]
      },
      {
        name: 'Semifinales',
        matches: [
          {
            id: 'rdi_sf_1',
            date: new Date('2023-09-17T19:00:00Z'),
            competitor1: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            },
            competitor2: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            }
          },
          {
            id: 'rdi_sf_2',
            date: new Date('2023-09-17T20:30:00Z'),
            competitor1: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            },
            competitor2: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            }
          }
        ]
      },
      {
        name: 'Final',
        matches: [
          {
            id: 'rdi_final',
            date: new Date('2023-09-24T20:00:00Z'),
            competitor1: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            },
            competitor2: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            }
          }
        ]
      }
    ]
  }
};

// Sample match results to update
const matchResults = [
  // FMS Internacional - Quarter Finals
  {
    leagueId: 'fms_internacional',
    matchId: 'fms_qf_1',
    winnerId: 'aczino',
    score1: 3,
    score2: 1
  },
  {
    leagueId: 'fms_internacional',
    matchId: 'fms_qf_2',
    winnerId: 'chuty',
    score1: 3,
    score2: 2
  },
  {
    leagueId: 'fms_internacional',
    matchId: 'fms_qf_3',
    winnerId: 'bnet',
    score1: 1,
    score2: 3
  },
  {
    leagueId: 'fms_internacional',
    matchId: 'fms_qf_4',
    winnerId: 'gazir',
    score1: 4,
    score2: 2
  },
  
  // FMS Internacional - Semi Finals
  {
    leagueId: 'fms_internacional',
    matchId: 'fms_sf_1',
    winnerId: 'aczino',
    score1: 3,
    score2: 2
  },
  {
    leagueId: 'fms_internacional',
    matchId: 'fms_sf_2',
    winnerId: 'gazir',
    score1: 2,
    score2: 3
  },
  
  // FMS Internacional - Final
  {
    leagueId: 'fms_internacional',
    matchId: 'fms_final',
    winnerId: 'aczino',
    score1: 5,
    score2: 4
  },
  
  // Red Bull Internacional - First Round (sample matches)
  {
    leagueId: 'redbull_internacional',
    matchId: 'rb_qf_1',
    winnerId: 'aczino',
    score1: 2,
    score2: 0
  },
  {
    leagueId: 'redbull_internacional',
    matchId: 'rb_qf_2',
    winnerId: 'chuty',
    score1: 2,
    score2: 1
  },
  
  // RDI - Quarter Finals
  {
    leagueId: 'rdi',
    matchId: 'rdi_qf_1',
    winnerId: 'yartzi',
    score1: 3,
    score2: 2
  },
  {
    leagueId: 'rdi',
    matchId: 'rdi_qf_2',
    winnerId: 'valles-t',
    score1: 4,
    score2: 1
  },
  {
    leagueId: 'rdi',
    matchId: 'rdi_qf_3',
    winnerId: 'letra',
    score1: 3,
    score2: 2
  },
  {
    leagueId: 'rdi',
    matchId: 'rdi_qf_4',
    winnerId: 'nitro',
    score1: 2,
    score2: 1
  }
];

// Function to check if knockout exists and create if not
async function checkAndCreateKnockout(leagueId) {
  try {
    console.log(`Checking knockout stage for league ${leagueId}...`);
    
    // Try to get the knockout stage
    const response = await axios.get(`${API_BASE_URL}/${leagueId}`);
    console.log(`Knockout stage for ${leagueId} already exists.`);
    return true;
    
  } catch (error) {
    // If 404, create the knockout stage
    if (error.response && error.response.status === 404) {
      console.log(`Knockout stage for ${leagueId} not found. Creating...`);
      
      try {
        const template = knockoutTemplates[leagueId];
        const createResponse = await axios.post(
          `${API_BASE_URL}/${leagueId}`,
          template
        );
        
        console.log(`Successfully created knockout stage for ${leagueId}`);
        return true;
      } catch (createError) {
        console.error(`Error creating knockout stage for ${leagueId}:`, createError.message);
        if (createError.response) {
          console.error('Response data:', createError.response.data);
        }
        return false;
      }
    } else {
      console.error(`Error checking knockout stage for ${leagueId}:`, error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      return false;
    }
  }
}

// Function to update match results
async function updateMatchResult(result) {
  try {
    console.log(`Updating match ${result.matchId} for league ${result.leagueId}...`);
    
    const response = await axios.patch(
      `${API_BASE_URL}/${result.leagueId}/match/${result.matchId}`,
      {
        winnerId: result.winnerId,
        score1: result.score1,
        score2: result.score2
      }
    );
    
    console.log(`Successfully updated match ${result.matchId}. Winner: ${result.winnerId}`);
    return true;
  } catch (error) {
    console.error(`Error updating match ${result.matchId}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Main function to populate knockout stages
async function populateKnockout() {
  console.log('Starting to populate knockout stages...');
  
  // First, check and create knockout stages if needed
  for (const leagueId of leagueIds) {
    await checkAndCreateKnockout(leagueId);
  }
  
  // Then, update match results
  for (const result of matchResults) {
    await updateMatchResult(result);
  }
  
  console.log('Finished populating knockout stages.');
}

// Run the populate function
populateKnockout().catch(error => {
  console.error('Script execution failed:', error);
}); 