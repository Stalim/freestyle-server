require('dotenv').config({ path: '../../.env' });
const axios = require('axios');

// Base URL for API requests
const API_BASE_URL = 'http://localhost:3001/api/knockout';

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
    matchId: 'rb_of_1',
    winnerId: 'aczino',
    score1: 2,
    score2: 0
  },
  {
    leagueId: 'redbull_internacional',
    matchId: 'rb_of_2',
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

// Function to update match results
async function updateMatchResults() {
  console.log('Starting to update knockout match results...');
  
  for (const result of matchResults) {
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
    } catch (error) {
      console.error(`Error updating match ${result.matchId}:`, error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  }
  
  console.log('Finished updating knockout match results.');
}

// Run the update function
updateMatchResults().catch(error => {
  console.error('Script execution failed:', error);
}); 