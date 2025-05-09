const axios = require('axios');

const API_URL = 'https://web-production-2277.up.railway.app/api/players';

// Test next match data
const nextMatchData = {
    nextMatch: {
        id: 'gazir',
        opponent: 'chuty',
        date: '2024-05-15T20:00:00Z',
        league: 'FMS España',
        round: 'Semifinales'
    }
};

async function updateNextMatch() {
    try {
        console.log('Updating next match for player: gazir');
        
        // First update the next match
        const updateResponse = await axios.patch(`${API_URL}/gazir`, {
            playerData: JSON.stringify({
                nextMatch: {
                    id: 'gazir',
                    opponent: 'chuty',
                    date: '2024-05-15T20:00:00Z',
                    league: 'FMS España',
                    round: 'Semifinales'
                }
            })
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Successfully updated next match:', updateResponse.data);
        
        // Then fetch the player data to verify
        console.log('\nVerifying the update by fetching player data...');
        const getResponse = await axios.get(`${API_URL}/gazir`);
        console.log('\nFetched player data:', JSON.stringify(getResponse.data, null, 2));
        
        // Specifically check the nextMatch field
        console.log('\nNext match data:', getResponse.data.nextMatch);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

// Run the update
updateNextMatch(); 