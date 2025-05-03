const puppeteer = require('puppeteer');

async function scrapeFMSMC(mcId, league = 'espana') {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 60000 // 60 second timeout
    });

    try {
        const page = await browser.newPage();
        
        // Set viewport and user agent
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
        
        // First get the standings data
        console.log(`Fetching standings data for ${mcId} from ${league}...`);
        await page.goto(`https://fms.tv/clasificacion/${league}/`, { 
            waitUntil: 'networkidle0',
            timeout: 30000 // 30 second timeout
        });
        
        // Wait for the standings table to load with retry
        let standingsData = null;
        let retries = 3;
        
        while (retries > 0 && !standingsData) {
            try {
                await page.waitForSelector('.tabla-clasificacion', { timeout: 10000 });
                
                // Get all rows from the standings table
                standingsData = await page.evaluate((mcId, league) => {
                    const rows = Array.from(document.querySelectorAll('.tabla-clasificacion tbody tr'));
                    for (const row of rows) {
                        const nameCell = row.querySelector('td:nth-child(2)');
                        const name = nameCell ? nameCell.textContent.trim().toLowerCase() : '';
                        
                        // Convert name to match mcId format (lowercase, replace spaces with hyphens)
                        const rowMcId = name.replace(/\s+/g, '-');
                        
                        if (rowMcId === mcId) {
                            return {
                                seasons: league === 'espana' ? '7' : '3', // FMS Spain has had 7 seasons, Colombia 3
                                victories: row.querySelector('td:nth-child(4)').textContent.trim(),
                                defeats: row.querySelector('td:nth-child(5)').textContent.trim(),
                                trophies: row.querySelector('td:nth-child(8)').textContent.trim()
                            };
                        }
                    }
                    return null;
                }, mcId, league);
            } catch (error) {
                console.log(`Retry ${4 - retries} failed: ${error.message}`);
                retries--;
                if (retries > 0) {
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
                }
            }
        }
        
        if (!standingsData) {
            console.log(`Could not find standings data for ${mcId}, using default values`);
            standingsData = {
                seasons: league === 'espana' ? '7' : '3',
                victories: '0',
                defeats: '0',
                trophies: '0'
            };
        }
        
        // Now get the MC's profile data
        console.log(`Fetching profile data for ${mcId}...`);
        await page.goto(`https://fms.tv/mcs/${mcId}/`, { 
            waitUntil: 'networkidle0',
            timeout: 30000 // 30 second timeout
        });
        
        const mcData = await page.evaluate((league) => {
            const name = document.querySelector('.nombre-mc h1')?.textContent.trim() || '';
            const birthPlace = document.querySelector('.lugar-nacimiento')?.textContent.trim() || 'España';
            const birthDate = document.querySelector('.fecha-nacimiento')?.textContent.trim() || '2000-01-01';
            const biography = document.querySelector('.biografia-mc')?.textContent.trim() || '';
            
            const images = {
                profile: document.querySelector('.foto-mc img')?.src || 'https://fms.tv/wp-content/uploads/2024/03/default-profile.png',
                logo: document.querySelector('.logo-mc img')?.src || 'https://fms.tv/wp-content/uploads/2024/03/default-profile.png'
            };
            
            const socialMedia = {
                twitter: document.querySelector('.rrss-mc a[href*="twitter"]')?.href || '',
                facebook: document.querySelector('.rrss-mc a[href*="facebook"]')?.href || '',
                instagram: document.querySelector('.rrss-mc a[href*="instagram"]')?.href || '',
                tiktok: document.querySelector('.rrss-mc a[href*="tiktok"]')?.href || ''
            };
            
            return {
                name,
                birthPlace,
                birthDate,
                biography: biography || `${name} es un MC de FMS ${league === 'espana' ? 'España' : 'Colombia'}, conocido por su estilo único y sus destacadas participaciones en batallas de freestyle.`,
                images,
                socialMedia
            };
        }, league);
        
        // Combine the data
        const finalData = {
            id: mcId,
            ...mcData,
            statistics: standingsData,
            leagues: [league],
            famousQuotes: []
        };
        
        console.log('Successfully scraped data:', JSON.stringify(finalData, null, 2));
        return finalData;
    } catch (error) {
        console.error(`Error scraping MC ${mcId}:`, error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Example usage
async function main() {
    try {
        const mcId = process.argv[2] || 'chuty';
        const league = process.argv[3] || 'espana';
        const data = await scrapeFMSMC(mcId, league);
        console.log('\nMC Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error in main:', error.message);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = {
    scrapeFMSMC
}; 