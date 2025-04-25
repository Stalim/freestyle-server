import Foundation

/// Documentation for the Freestyle API server
enum ServerInfo {
    /// Base URL for the API server
    static let baseURL = "https://ifree-production.up.railway.app"
    
    /// Available API endpoints
    enum Endpoints {
        /// Returns all freestyle leagues and their standings
        /// Method: GET
        /// Response: Array of League objects containing league information and entries
        static let leagues = "\(baseURL)/api/tabla"
        
        /// Returns detailed information about a specific player
        /// Method: GET
        /// Parameters: name - The player's name
        /// Response: Player object containing detailed player information and statistics
        static func playerProfile(name: String) -> String {
            return "\(baseURL)/api/players/\(name)"
        }
    }
    
    /// Response Models Documentation
    enum Models {
        /// League Model Fields:
        /// - id: String (Unique identifier)
        /// - name: String (League name)
        /// - entries: [Entry] (Array of participant entries)
        /// - createdAt: String (Creation timestamp)
        /// - updatedAt: String (Last update timestamp)
        static let leagueModelDescription = "League data model"
        
        /// Entry Model Fields:
        /// - name: String (Participant name)
        /// - position: Int (Current standing position)
        /// - points: Int (Total points)
        /// - played: Int (Matches played)
        /// - won: Int (Matches won)
        /// - lost: Int (Matches lost)
        /// - draws: Int (Matches drawn)
        /// - score: Int (Total score)
        static let entryModelDescription = "League entry/participant data model"
        
        /// Player Model Fields:
        /// - name: String (Player name)
        /// - country: String (Player's country)
        /// - stats: PlayerStats (Player statistics)
        /// - description: String (Player description/bio)
        /// - image: String (URL to player's image)
        static let playerModelDescription = "Player profile data model"
    }
    
    /// Server Status
    static let serverStatus = """
        Server is hosted on Railway.app
        Base URL: \(baseURL)
        Status: Active
        """
    
    /// Usage Examples
    static let examples = """
        // Fetch all leagues
        GET \(Endpoints.leagues)
        
        // Fetch player profile
        GET \(Endpoints.playerProfile(name: "dtoke"))
        """
} 