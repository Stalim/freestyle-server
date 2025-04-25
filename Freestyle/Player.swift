import Foundation

struct Player: Codable, Identifiable {
    let id: String
    let name: String
    let imageUrl: String
    let bannerUrl: String
    let age: Int
    let nationality: String
    let rapStyle: String
    let stats: PlayerStats
    let achievements: [String]
    let description: String
    let createdAt: String
    let updatedAt: String
    
    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case name
        case imageUrl
        case bannerUrl
        case age
        case nationality
        case rapStyle
        case stats
        case achievements
        case description
        case createdAt
        case updatedAt
    }
    
    var fullImageUrl: String {
        if imageUrl.hasPrefix("http") {
            return imageUrl
        }
        return "https://web-production-2277.up.railway.app\(imageUrl)"
    }
    
    var fullBannerUrl: String {
        if bannerUrl.hasPrefix("http") {
            return bannerUrl
        }
        return "https://web-production-2277.up.railway.app\(bannerUrl)"
    }
}

struct PlayerStats: Codable {
    let wins: Int
    let losses: Int
    let draws: Int
    let winRate: Double
    
    enum CodingKeys: String, CodingKey {
        case wins
        case losses
        case draws
        case winRate
    }
} 