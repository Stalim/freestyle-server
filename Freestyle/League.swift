import Foundation

struct League: Codable, Identifiable {
    let id: String
    let name: String
    let entries: [Entry]
    let icon: String?
    let createdAt: String
    let updatedAt: String
    
    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case name
        case entries
        case icon
        case createdAt
        case updatedAt
    }
    
    var displayIcon: String {
        return icon ?? "fms_logo"
    }
}

struct Entry: Codable, Identifiable {
    let id: String
    let position: Int
    let name: String
    let battlesDisputed: Int
    let points: Int
    let wonBattles: Int
    let lostBattles: Int
    
    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case position
        case name
        case battlesDisputed
        case points
        case wonBattles
        case lostBattles
    }
    
    // Add computed properties for compatibility
    var matches: Int {
        return battlesDisputed
    }
    
    var battlesWon: Int {
        return wonBattles
    }
    
    var battlesLost: Int {
        return lostBattles
    }
}

struct Participant: Codable, Identifiable {
    var id: String { name } // Using name as id since we don't have a specific id
    let name: String
    let points: Int
    let position: Int
    let played: Int
    let wins: Int
    let draws: Int
    let losses: Int
    let goalsFor: Int
    let goalsAgainst: Int
    let goalDifference: Int
} 