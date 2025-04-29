import requests
from bs4 import BeautifulSoup
import json
from typing import Dict, List
from dataclasses import dataclass
from datetime import datetime
import sys

@dataclass
class MCStats:
    position: int
    name: str
    points: int
    victories: int
    referee_victories: int
    referee_defeats: int
    defeats: int
    points_per_battle: int
    mvp_count: int

class FMSScraper:
    def __init__(self, country: str):
        self.base_url = "https://fms.tv/clasificacion"
        self.country = country.lower()
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0'
        })

    def safe_int_convert(self, value: str, default: int = 0) -> int:
        """Safely convert string to integer with a default value."""
        try:
            return int(value.strip()) if value.strip() else default
        except (ValueError, AttributeError):
            return default

    def get_league_data(self) -> List[MCStats]:
        """Fetch and parse the league standings data from FMS website."""
        url = f"{self.base_url}/{self.country}/"  # Add trailing slash
        try:
            response = self.session.get(url, allow_redirects=True)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find the ranking tab for the specific country
            ranking_tab = soup.find('div', class_='ranking-tab', attrs={'data-league': self.country})
            if not ranking_tab:
                raise ValueError(f"Could not find ranking tab for {self.country}")
            
            # Find the table within the ranking tab
            table = ranking_tab.find('table', class_='ranking-group__table')
            if not table:
                raise ValueError(f"Could not find standings table for {self.country}")
            
            mc_stats = []
            position = 1  # Initialize position counter
            
            for row in table.find_all('tr')[1:]:  # Skip header row
                columns = row.find_all('td')
                if len(columns) >= 9:
                    # Clean up name by removing everything after asterisk
                    name = columns[1].text.strip()
                    if '*' in name:
                        name = name.split('*')[0].strip()
                    
                    # Extract text and handle empty values
                    stats = MCStats(
                        position=position,  # Use the counter for position
                        name=name,
                        points=self.safe_int_convert(columns[2].text),
                        victories=self.safe_int_convert(columns[3].text),
                        referee_victories=self.safe_int_convert(columns[4].text),
                        referee_defeats=self.safe_int_convert(columns[5].text),
                        defeats=self.safe_int_convert(columns[6].text),
                        points_per_battle=self.safe_int_convert(columns[7].text),
                        mvp_count=self.safe_int_convert(columns[8].text)
                    )
                    if stats.name:  # Only add if name is not empty
                        mc_stats.append(stats)
                        position += 1  # Increment position counter
            
            return mc_stats
        except Exception as e:
            raise Exception(f"Error fetching league data for {self.country}: {str(e)}")

    def transform_to_railway_format(self, mc_stats: List[MCStats]) -> dict:
        """Transform MCStats to Railway format."""
        entries = []
        for stat in mc_stats:
            entry = {
                "position": stat.position,
                "name": stat.name,
                "matches": stat.victories + stat.referee_victories + stat.referee_defeats + stat.defeats,
                "points": stat.points,
                "bg": stat.victories + stat.referee_victories,
                "bp": stat.defeats + stat.referee_defeats
            }
            entries.append(entry)
        
        # Use "FMS World Series" as the name for fmsws
        league_name = "FMS World Series" if self.country == "fmsws" else f"fms_{self.country}"
        
        return {
            "name": league_name,
            "entries": entries
        }

    def update_railway(self, railway_data: dict) -> dict:
        """
        Send the transformed data to the Railway endpoint.
        
        Args:
            railway_data: Data in Railway format from transform_to_railway_format()
            
        Returns:
            dict: Response from the Railway API
        """
        url = "https://web-production-2277.up.railway.app/api/tabla"
        headers = {
            'Content-Type': 'application/json'
        }
        
        try:
            response = self.session.put(f"{url}/{railway_data['name']}", 
                                      json=railway_data,
                                      headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Error updating Railway: {str(e)}")

    def calculate_league_stats(self, mc_stats: List[MCStats]) -> Dict:
        """Calculate league statistics and format for API update."""
        total_mcs = len(mc_stats)
        total_battles = sum(mc.victories + mc.defeats + mc.referee_victories + mc.referee_defeats for mc in mc_stats)
        
        # Calculate average points per battle across all MCs
        avg_points_per_battle = sum(mc.points_per_battle for mc in mc_stats) / total_mcs if total_mcs > 0 else 0
        
        # Format the data for API update
        update_data = {
            "country": self.country,
            "last_updated": datetime.now().isoformat(),
            "total_mcs": total_mcs,
            "total_battles": total_battles,
            "average_points_per_battle": round(avg_points_per_battle, 2),
            "standings": [
                {
                    "position": mc.position,
                    "name": mc.name,
                    "points": mc.points,
                    "victories": mc.victories,
                    "referee_victories": mc.referee_victories,
                    "referee_defeats": mc.referee_defeats,
                    "defeats": mc.defeats,
                    "points_per_battle": mc.points_per_battle,
                    "mvp_count": mc.mvp_count
                }
                for mc in mc_stats
            ]
        }
        
        return update_data

    def get_league_update(self) -> Dict:
        """Main method to get the complete league update data."""
        mc_stats = self.get_league_data()
        league_stats = self.calculate_league_stats(mc_stats)
        railway_data = self.transform_to_railway_format(mc_stats)
        
        # Update Railway endpoint
        try:
            railway_response = self.update_railway(railway_data)
            league_stats['railway_update'] = railway_response
        except Exception as e:
            league_stats['railway_update_error'] = str(e)
        
        return league_stats

def main():
    # Get country from command line arguments
    if len(sys.argv) > 1:
        country = sys.argv[1]
    else:
        country = "argentina"  # Default country
    
    scraper = FMSScraper(country)
    
    try:
        # Get the raw FMS data
        mc_stats = scraper.get_league_data()
        
        # Transform to Railway format
        railway_data = scraper.transform_to_railway_format(mc_stats)
        
        # Print the transformed data with BT header
        print("Transformed data:")
        print(json.dumps(railway_data, indent=2))
        
        # Print a formatted table with BT header
        print("\nFormatted Table:")
        print(f"{'Pos':<4} {'Name':<20} {'BT':<4} {'Points':<6} {'BG':<4} {'BP':<4}")
        print("-" * 50)
        for entry in railway_data['entries']:
            print(f"{entry['position']:<4} {entry['name']:<20} {entry['matches']:<4} {entry['points']:<6} {entry['bg']:<4} {entry['bp']:<4}")
        
        # Update Railway
        print("\nSending data to Railway...")
        response = scraper.update_railway(railway_data)
        print("\nRailway response:")
        print(json.dumps(response, indent=2))
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main() 