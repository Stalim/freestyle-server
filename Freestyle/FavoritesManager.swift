import Foundation

class FavoritesManager: ObservableObject {
    @Published var favoriteLeagues: Set<String> = []
    private let favoritesKey = "FavoriteLeagues"
    
    static let shared = FavoritesManager()
    
    init() {
        loadFavorites()
    }
    
    private func loadFavorites() {
        if let data = UserDefaults.standard.array(forKey: favoritesKey) as? [String] {
            favoriteLeagues = Set(data)
        }
    }
    
    private func saveFavorites() {
        UserDefaults.standard.set(Array(favoriteLeagues), forKey: favoritesKey)
    }
    
    func toggleFavorite(for leagueId: String) {
        if favoriteLeagues.contains(leagueId) {
            favoriteLeagues.remove(leagueId)
        } else {
            favoriteLeagues.insert(leagueId)
        }
        saveFavorites()
    }
    
    func isFavorite(_ leagueId: String) -> Bool {
        favoriteLeagues.contains(leagueId)
    }
} 