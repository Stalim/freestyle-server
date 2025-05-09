const axios = require('axios');

const API_URL = 'https://web-production-2277.up.railway.app/api/players';

async function updateNextMatches() {
    try {
        // First get all players
        const response = await axios.get(API_URL);
        const players = response.data;
        
        console.log(`Found ${players.length} players to update`);
        
        // Update each player with a default TBD next match
        for (const player of players) {
            try {
                // First get the current player data to preserve it
                const currentPlayer = await axios.get(`${API_URL}/${player.id}`);
                const existingData = currentPlayer.data;

                // Create the next match data
                const nextMatch = {
                    id: player.id,
                    opponent: "TBD",
                    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
                    league: player.leagues[0] || "FMS", // Use first league or default to FMS
                    round: "Próxima Ronda"
                };

                // Create update data that only includes the nextMatch field
                const updateData = {
                    playerData: JSON.stringify({
                        ...existingData,
                        nextMatch
                    })
                };

                await axios.patch(`${API_URL}/${player.id}`, updateData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log(`Updated next match for player: ${player.name}`);
            } catch (error) {
                console.error(`Failed to update player ${player.name}:`, error.message);
            }
        }
        
        console.log('Finished updating next matches');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Run the function
updateNextMatches(); 