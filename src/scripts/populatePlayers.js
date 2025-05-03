const axios = require('axios');
const { scrapeFMSMC } = require('./fmsScraper');

const API_URL = 'https://web-production-2277.up.railway.app/api/players';

// List of Colombian MCs
const COLOMBIAN_MCS = [
    'valles-t',
    'carpediem',
    'elevn',
    'marithea',
    'filosofo',
    'jbeat',
    'chang',
    'lokillo',
    'airon',
    'fat-n',
    'g-sony',
    'rbn',
    'coloso'
];

// List of Spanish MCs
const SPANISH_MCS = [
    'chuty',
    'gazir',
    'sweet-pain',
    'mnak',
    'sancer',
    'zasko',
    'blon',
    'sara-socas'
];

async function updatePlayer(mcId, league) {
    try {
        console.log(`\nProcessing MC: ${mcId} from ${league}`);
        
        // Get fresh data from the website
        try {
            const mcData = await scrapeFMSMC(mcId, league);
            console.log(`Successfully scraped data for ${mcId}`);
            console.log('Scraped data:', JSON.stringify(mcData, null, 2));
            
            // Update the player in the database
            try {
                const response = await axios.put(`${API_URL}/${mcId}`, {
                    playerData: JSON.stringify(mcData)
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log(`Successfully updated ${mcData.name} in database`);
                console.log('Updated data:', JSON.stringify(response.data, null, 2));
            } catch (putError) {
                console.log(`Failed to update MC ${mcId} in database:`, putError.response?.data || putError.message);
            }
        } catch (scrapeError) {
            console.log(`Failed to process MC ${mcId}: ${scrapeError.message}`);
        }
    } catch (error) {
        console.error(`Error in updatePlayer for ${mcId}:`, error);
    }
}

// Get command line arguments
const args = process.argv.slice(2);
const country = args[0]?.toLowerCase();
const name = args[1]?.toLowerCase();

if (!country || !name) {
    console.log('Usage: node populatePlayers.js <country> <name>');
    console.log('Example: node populatePlayers.js espana chuty');
    console.log('Available countries: espana, colombia');
    process.exit(1);
}

if (country !== 'espana' && country !== 'colombia') {
    console.log('Invalid country. Available options: espana, colombia');
    process.exit(1);
}

// Convert name to mcId format (lowercase, replace spaces with hyphens)
const mcId = name.replace(/\s+/g, '-');

// Run the script with the provided parameters
updatePlayer(mcId, country);
