const axios = require('axios');

const API_URL = 'https://web-production-2277.up.railway.app/api/players';

// List of Colombian MCs with their statistics
const COLOMBIAN_MCS = [
    {
        id: 'valles-t',
        statistics: {
            seasons: '3',
            victories: '27',
            defeats: '9',
            trophies: '2'
        }
    },
    {
        id: 'carpediem',
        statistics: {
            seasons: '3',
            victories: '18',
            defeats: '12',
            trophies: '1'
        }
    },
    {
        id: 'elevn',
        statistics: {
            seasons: '3',
            victories: '15',
            defeats: '15',
            trophies: '0'
        }
    },
    {
        id: 'marithea',
        statistics: {
            seasons: '3',
            victories: '24',
            defeats: '8',
            trophies: '1'
        }
    },
    {
        id: 'filosofo',
        statistics: {
            seasons: '3',
            victories: '20',
            defeats: '10',
            trophies: '1'
        }
    },
    {
        id: 'jbeat',
        statistics: {
            seasons: '3',
            victories: '16',
            defeats: '14',
            trophies: '0'
        }
    },
    {
        id: 'chang',
        statistics: {
            seasons: '3',
            victories: '19',
            defeats: '11',
            trophies: '0'
        }
    },
    {
        id: 'lokillo',
        statistics: {
            seasons: '3',
            victories: '17',
            defeats: '13',
            trophies: '0'
        }
    },
    {
        id: 'airon',
        statistics: {
            seasons: '3',
            victories: '14',
            defeats: '16',
            trophies: '0'
        }
    },
    {
        id: 'fat-n',
        statistics: {
            seasons: '3',
            victories: '13',
            defeats: '17',
            trophies: '0'
        }
    },
    {
        id: 'g-sony',
        statistics: {
            seasons: '3',
            victories: '12',
            defeats: '18',
            trophies: '0'
        }
    },
    {
        id: 'rbn',
        statistics: {
            seasons: '3',
            victories: '11',
            defeats: '19',
            trophies: '0'
        }
    },
    {
        id: 'coloso',
        statistics: {
            seasons: '3',
            victories: '10',
            defeats: '20',
            trophies: '0'
        }
    }
];

// List of Spanish MCs with their statistics
const SPANISH_MCS = [
    {
        id: 'chuty',
        statistics: {
            seasons: '6',
            victories: '42',
            defeats: '12',
            trophies: '2'
        }
    },
    {
        id: 'gazir',
        statistics: {
            seasons: '4',
            victories: '35',
            defeats: '15',
            trophies: '1'
        }
    },
    {
        id: 'sweet-pain',
        statistics: {
            seasons: '3',
            victories: '28',
            defeats: '18',
            trophies: '0'
        }
    },
    {
        id: 'mnak',
        statistics: {
            seasons: '2',
            victories: '25',
            defeats: '21',
            trophies: '0'
        }
    },
    {
        id: 'sancer',
        statistics: {
            seasons: '2',
            victories: '24',
            defeats: '22',
            trophies: '0'
        }
    },
    {
        id: 'zasko',
        statistics: {
            seasons: '2',
            victories: '23',
            defeats: '23',
            trophies: '0'
        }
    },
    {
        id: 'blon',
        statistics: {
            seasons: '2',
            victories: '21',
            defeats: '25',
            trophies: '0'
        }
    },
    {
        id: 'sara-socas',
        statistics: {
            seasons: '2',
            victories: '20',
            defeats: '26',
            trophies: '0'
        }
    }
];

async function updateFMSStats() {
    try {
        console.log('Starting to update FMS statistics for players...');
        
        // Process Colombian MCs
        console.log(`Found ${COLOMBIAN_MCS.length} Colombian MCs to process`);
        for (const mc of COLOMBIAN_MCS) {
            try {
                console.log(`\nProcessing Colombian MC: ${mc.id}`);
                
                // Get current MC data
                const response = await axios.get(`${API_URL}/${mc.id}`);
                if (response.status === 200) {
                    const currentData = response.data;
                    console.log('Current data:', JSON.stringify(currentData, null, 2));
                    
                    // Update only the statistics
                    const updatedData = {
                        ...currentData,
                        statistics: mc.statistics
                    };
                    
                    // Update the MC in the database
                    await axios.put(`${API_URL}/${mc.id}`, {
                        playerData: JSON.stringify(updatedData)
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    console.log(`Successfully updated statistics for ${mc.id}`);
                }
            } catch (error) {
                console.log(`Error updating Colombian MC ${mc.id}:`, error.response?.data || error.message);
            }
        }

        // Process Spanish MCs
        console.log(`\nFound ${SPANISH_MCS.length} Spanish MCs to process`);
        for (const mc of SPANISH_MCS) {
            try {
                console.log(`\nProcessing Spanish MC: ${mc.id}`);
                
                // Get current MC data
                const response = await axios.get(`${API_URL}/${mc.id}`);
                if (response.status === 200) {
                    const currentData = response.data;
                    console.log('Current data:', JSON.stringify(currentData, null, 2));
                    
                    // Update only the statistics
                    const updatedData = {
                        ...currentData,
                        statistics: mc.statistics
                    };
                    
                    // Update the MC in the database
                    await axios.put(`${API_URL}/${mc.id}`, {
                        playerData: JSON.stringify(updatedData)
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    console.log(`Successfully updated statistics for ${mc.id}`);
                }
            } catch (error) {
                console.log(`Error updating Spanish MC ${mc.id}:`, error.response?.data || error.message);
            }
        }
        
        console.log('\nFinished updating FMS statistics');
    } catch (error) {
        console.error('Error in updateFMSStats:', error);
    }
}

// Export the function
module.exports = updateFMSStats; 