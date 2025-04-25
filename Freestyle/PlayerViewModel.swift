import Foundation

@MainActor
class PlayerViewModel: ObservableObject {
    @Published var player: Player?
    @Published var isLoading = false
    @Published var error: String?
    
    func fetchPlayer(name: String) {
        isLoading = true
        error = nil
        
        // Convert name to lowercase and remove any special characters for the ID
        let playerId = name.lowercased()
            .replacingOccurrences(of: " ", with: "")
            .folding(options: .diacriticInsensitive, locale: .current)
        
        let apiURL = "https://web-production-2277.up.railway.app/api/players/\(playerId)"
        
        guard let url = URL(string: apiURL) else {
            error = "Invalid URL"
            isLoading = false
            return
        }
        
        Task {
            do {
                let (data, _) = try await URLSession.shared.data(from: url)
                let decoder = JSONDecoder()
                decoder.keyDecodingStrategy = .useDefaultKeys
                let player = try decoder.decode(Player.self, from: data)
                self.player = player
                self.isLoading = false
            } catch {
                print("Decoding Error: \(error)")
                self.error = "Error loading player data: \(error.localizedDescription)"
                self.isLoading = false
            }
        }
    }
} 