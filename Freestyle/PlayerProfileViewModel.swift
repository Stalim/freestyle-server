import Foundation

@MainActor
class PlayerProfileViewModel: ObservableObject {
    @Published var profile: Player?
    @Published var isLoading = false
    @Published var error: String?
    
    func loadPlayerProfile(name: String) {
        isLoading = true
        error = nil
        
        // Convert name to lowercase and remove any special characters for the ID
        let playerId = name.lowercased()
            .replacingOccurrences(of: " ", with: "")
            .folding(options: .diacriticInsensitive, locale: .current)
        
        guard let url = URL(string: "https://web-production-2277.up.railway.app/api/players/\(playerId)") else {
            error = "Invalid URL"
            isLoading = false
            return
        }
        
        URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            DispatchQueue.main.async {
                self?.isLoading = false
                
                if let error = error {
                    self?.error = error.localizedDescription
                    return
                }
                
                guard let data = data else {
                    self?.error = "No data received"
                    return
                }
                
                do {
                    let decoder = JSONDecoder()
                    decoder.keyDecodingStrategy = .useDefaultKeys
                    let profile = try decoder.decode(Player.self, from: data)
                    self?.profile = profile
                } catch {
                    print("Decoding error: \(error)")
                    self?.error = "Error decoding player data: \(error.localizedDescription)"
                }
            }
        }.resume()
    }
} 