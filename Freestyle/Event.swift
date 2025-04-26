import Foundation

struct Event: Codable, Identifiable {
    let id: String
    let title: String
    let date: String
    let description: String
    let location: String
    let time: String
    let imageUrl: String
    
    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case title
        case date
        case description
        case location
        case time
        case imageUrl
    }
    
    var image: String {
        "https://web-production-2277.up.railway.app\(imageUrl)"
    }
} 