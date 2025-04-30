const axios = require('axios');

const API_URL = 'https://web-production-2277.up.railway.app/api/tabla';

async function calculateRealisticValues(entry) {
  const points = entry.points;
  const matches = entry.matches;
  
  // Calculate minimum wins needed to achieve the points
  const minWins = Math.ceil(points / 3);
  // Calculate maximum possible wins (can't have more wins than matches)
  const maxWins = Math.min(matches, Math.floor(points / 3) + (points % 3 > 0 ? 1 : 0));
  
  // Choose a random number of wins between min and max
  const bg = Math.floor(Math.random() * (maxWins - minWins + 1)) + minWins;
  // Calculate draws based on remaining points
  const remainingPoints = points - (bg * 3);
  const draws = remainingPoints;
  // Calculate losses
  const bd = matches - bg - draws;
  
  return { bg, bd };
}

async function updateLeague(leagueName) {
  try {
    // Get current league data
    const response = await axios.get(`${API_URL}/${leagueName}`);
    const league = response.data;
    
    // Skip FMS España as it has its own random generation
    if (leagueName === 'fms_espana') {
      console.log(`Skipping ${leagueName} as it has its own random generation`);
      return;
    }
    
    // Update entries with realistic values
    const updatedEntries = await Promise.all(league.entries.map(async (entry) => {
      const { bg, bd } = await calculateRealisticValues(entry);
      return {
        ...entry,
        bg,
        bd
      };
    }));
    
    // Update the league
    await axios.put(`${API_URL}/${leagueName}`, {
      ...league,
      entries: updatedEntries
    });
    
    console.log(`Successfully updated ${leagueName}`);
  } catch (error) {
    console.error(`Error updating ${leagueName}:`, error.message);
  }
}

async function updateAllLeagues() {
  try {
    // Get all leagues
    const response = await axios.get(API_URL);
    const leagues = response.data;
    
    // Update each league
    for (const league of leagues) {
      await updateLeague(league.name);
    }
    
    console.log('All leagues updated successfully');
  } catch (error) {
    console.error('Error updating leagues:', error.message);
  }
}

// Run the update
updateAllLeagues(); 