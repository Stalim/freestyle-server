import json
from datetime import datetime
import re
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, StaleElementReferenceException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
import logging
import os

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def clean_text(text):
    if not text:
        return None
    return ' '.join(text.strip().split())

def parse_date(date_str):
    if not date_str:
        return None
    
    # Clean the date string
    date_str = clean_text(date_str.lower())
    if not date_str:
        return None

    # Extract year, month, and day using regex
    year_pattern = r'202[0-9]'  # Matches years 2020-2029
    month_pattern = r'(january|february|march|april|may|june|july|august|september|october|november|december|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)'
    day_pattern = r'\b([0-9]{1,2})(st|nd|rd|th)?\b'

    year_match = re.search(year_pattern, date_str)
    month_match = re.search(month_pattern, date_str)
    day_match = re.search(day_pattern, date_str)

    if not (year_match and month_match):
        return None

    year = year_match.group()
    month = month_match.group(1)
    day = day_match.group(1) if day_match else '1'

    # Convert Spanish month names to English
    month_mapping = {
        'enero': 'january', 'febrero': 'february', 'marzo': 'march',
        'abril': 'april', 'mayo': 'may', 'junio': 'june',
        'julio': 'july', 'agosto': 'august', 'septiembre': 'september',
        'octubre': 'october', 'noviembre': 'november', 'diciembre': 'december'
    }
    month = month_mapping.get(month, month)

    # Convert month name to number
    month_to_num = {
        'january': 1, 'february': 2, 'march': 3, 'april': 4,
        'may': 5, 'june': 6, 'july': 7, 'august': 8,
        'september': 9, 'october': 10, 'november': 11, 'december': 12
    }
    month_num = month_to_num.get(month.lower())

    if not month_num:
        return None

    try:
        return f"{year}-{month_num:02d}-{int(day):02d}"
    except (ValueError, TypeError):
        return None

def extract_location(title, description):
    if not title and not description:
        return None
    
    # List of known locations
    locations = [
        'Chile', 'Argentina', 'México', 'Mexico', 'España', 'Spain',
        'Perú', 'Peru', 'USA', 'Colombia', 'Centroamérica', 'Central America'
    ]
    
    # Check title first
    if title:
        for location in locations:
            if location.lower() in title.lower():
                return location

    # Then check description
    if description:
        for location in locations:
            if location.lower() in description.lower():
                return location

    return None

def format_url(title):
    if not title:
        return None
    
    base_url = "https://www.redbull.com/us-en/events"
    
    # Convert to lowercase and replace special characters
    url_friendly = title.lower().strip()
    # Replace Spanish characters
    url_friendly = url_friendly.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ñ', 'n')
    # Remove all characters except alphanumeric and spaces
    url_friendly = re.sub(r'[^a-z0-9\s-]', '', url_friendly)
    # Replace spaces with hyphens and remove multiple hyphens
    url_friendly = re.sub(r'\s+', '-', url_friendly)
    url_friendly = re.sub(r'-+', '-', url_friendly)
    
    return f"{base_url}/{url_friendly}"

def extract_events_from_page(driver):
    events = []
    processed_titles = set()
    
    # Find all event elements
    event_elements = driver.find_elements(By.CSS_SELECTOR, "[class*='event-card'], [class*='batalla'], [class*='battle']")
    
    for element in event_elements:
        try:
            # Get title
            title = None
            try:
                title_elem = element.find_element(By.CSS_SELECTOR, "h1, h2, h3, h4, [class*='title']")
                title = clean_text(title_elem.text)
            except:
                continue
                
            if not title or title in processed_titles or 'batalla' not in title.lower():
                continue
                
            processed_titles.add(title)
            
            # Get date
            date = None
            try:
                date_elem = element.find_element(By.CSS_SELECTOR, "[class*='date'], time, [datetime]")
                date = parse_date(date_elem.get_attribute('datetime') or date_elem.text)
            except:
                pass
            
            # Get description
            description = None
            try:
                desc_elem = element.find_element(By.CSS_SELECTOR, "p, [class*='description']")
                description = clean_text(desc_elem.text)
            except:
                pass
            
            # Get URL
            url = None
            try:
                link_elem = element.find_element(By.CSS_SELECTOR, "a")
                url = link_elem.get_attribute('href')
            except:
                url = format_url(title)
            
            # Get location
            location = extract_location(title, description)
            
            event = {
                "title": title,
                "start_date": date,
                "location": location,
                "url": url,
                "description": description
            }
            
            events.append(event)
            logging.info(f"Found event: {title}")
            
        except Exception as e:
            continue
            
    return events

def analyze_page_source(driver):
    # Get page source and log it for analysis
    page_source = driver.page_source
    logging.info("Analyzing page source...")
    
    # Look for navigation elements
    nav_patterns = [
        'data-testid="calendar-navigation"',
        'data-testid="date-picker"',
        'data-testid="event-list"',
        'class="calendar-navigation"',
        'class="date-picker"',
        'class="event-list"'
    ]
    
    for pattern in nav_patterns:
        if pattern in page_source:
            logging.info(f"Found navigation pattern: {pattern}")
    
    # Look for event data in the source
    event_patterns = [
        'data-testid="event-card"',
        'class="event-card"',
        'class="batalla"',
        'class="battle"'
    ]
    
    for pattern in event_patterns:
        if pattern in page_source:
            logging.info(f"Found event pattern: {pattern}")
    
    # Look for any script tags that might control navigation
    script_tags = re.findall(r'<script[^>]*>(.*?)</script>', page_source, re.DOTALL)
    for script in script_tags:
        if 'navigation' in script or 'calendar' in script or 'event' in script:
            logging.info("Found relevant script content")
            
def get_redbull_events():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36')

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    wait = WebDriverWait(driver, 5)
    
    try:
        url = "https://www.redbull.com/us-en/event-series/red-bull-batalla"
        driver.get(url)
        logging.info(f"Page title: {driver.title}")
        
        # Accept cookies if present
        try:
            cookie_button = wait.until(EC.element_to_be_clickable((By.ID, "onetrust-accept-btn-handler")))
            cookie_button.click()
            logging.info("Accepted cookies")
        except TimeoutException:
            logging.info("No cookie consent button found")
        
        # Wait for page to load completely
        time.sleep(2)
        
        # Try to extract events from JavaScript state
        js_events_script = """
        function getAllEvents() {
            // Try different state objects
            const state = window.__INITIAL_STATE__ || window.__PRELOADED_STATE__ || {};
            const events = [];
            
            // Look for events in common paths
            const possiblePaths = [
                'events',
                'data.events',
                'eventData',
                'calendar.events',
                'state.events',
                'pageData.events'
            ];
            
            for (const path of possiblePaths) {
                const parts = path.split('.');
                let current = state;
                for (const part of parts) {
                    current = current?.[part];
                }
                if (Array.isArray(current)) {
                    events.push(...current);
                }
            }
            
            // Look for events in any array property
            function findEventArrays(obj, depth = 0) {
                if (depth > 5) return []; // Limit recursion
                if (!obj || typeof obj !== 'object') return [];
                
                let found = [];
                for (const [key, value] of Object.entries(obj)) {
                    if (Array.isArray(value) && value.length > 0 && 
                        value[0] && typeof value[0] === 'object' &&
                        (key.includes('event') || value[0].title || value[0].date)) {
                        found.push(...value);
                    } else if (typeof value === 'object') {
                        found.push(...findEventArrays(value, depth + 1));
                    }
                }
                return found;
            }
            
            events.push(...findEventArrays(window));
            
            // Try to find events in rendered DOM
            const eventElements = document.querySelectorAll('[class*="event"], [class*="batalla"], [class*="battle"]');
            for (const elem of eventElements) {
                const event = {
                    title: elem.querySelector('h1, h2, h3, h4, [class*="title"]')?.textContent,
                    date: elem.querySelector('[class*="date"], time, [datetime]')?.getAttribute('datetime') || 
                          elem.querySelector('[class*="date"], time, [datetime]')?.textContent,
                    description: elem.querySelector('p, [class*="description"]')?.textContent,
                    url: elem.querySelector('a')?.href
                };
                if (event.title && event.title.toLowerCase().includes('batalla')) {
                    events.push(event);
                }
            }
            
            return events;
        }
        return getAllEvents();
        """
        
        events_data = driver.execute_script(js_events_script)
        logging.info(f"Found {len(events_data) if events_data else 0} events in JavaScript state")
        
        all_events = []
        processed_titles = set()
        
        if events_data:
            for event_data in events_data:
                try:
                    title = clean_text(event_data.get('title'))
                    if not title or title in processed_titles or 'batalla' not in title.lower():
                        continue
                        
                    processed_titles.add(title)
                    
                    date = parse_date(event_data.get('date'))
                    description = clean_text(event_data.get('description'))
                    url = event_data.get('url')
                    if not url:
                        url = format_url(title)
                        
                    location = extract_location(title, description)
                    
                    event = {
                        "title": title,
                        "start_date": date,
                        "location": location,
                        "url": url,
                        "description": description
                    }
                    
                    all_events.append(event)
                    logging.info(f"Processed event: {title}")
                    
                except Exception as e:
                    continue
        
        # If no events found in JavaScript state, fall back to DOM scraping
        if not all_events:
            events = extract_events_from_page(driver)
            all_events.extend(events)
        
        # Sort events by date
        all_events.sort(key=lambda x: x['start_date'] if x['start_date'] else '9999-12-31')
        
        result = {
            "events": all_events,
            "total_events": len(all_events),
            "last_updated": datetime.now().isoformat()
        }
        
        return result
        
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return {"events": [], "total_events": 0, "last_updated": datetime.now().isoformat()}
        
    finally:
        driver.quit()

if __name__ == "__main__":
    result = get_redbull_events()
    print(json.dumps(result, indent=2, ensure_ascii=False)) 