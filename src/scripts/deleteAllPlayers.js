const axios = require('axios');

const API_URL = 'https://web-production-2277.up.railway.app/api/players';

async function deleteAllPlayers() {
    try {
        // First get all players
        const response = await axios.get(API_URL);
        const players = response.data;
        
        console.log(`Found ${players.length} players to delete`);
        
        // Delete each player
        for (const player of players) {
            try {
                await axios.delete(`${API_URL}/${player.id}`);
                console.log(`Deleted player: ${player.name}`);
            } catch (error) {
                console.error(`Failed to delete player ${player.name}:`, error.message);
            }
        }
        
        console.log('Finished deleting players');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Run the function
deleteAllPlayers(); 