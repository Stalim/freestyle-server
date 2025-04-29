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
        // Check if imageUrl is a complete URL
        if imageUrl.hasPrefix("http") {
            return imageUrl
        }
        
        // Check if imageUrl starts with a slash
        let path = imageUrl.hasPrefix("/") ? imageUrl : "/\(imageUrl)"
        
        // Construct the full URL
        return "https://web-production-2277.up.railway.app\(path)"
    }
} 