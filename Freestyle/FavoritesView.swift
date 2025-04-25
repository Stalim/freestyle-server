import SwiftUI

struct FavoritesView: View {
    @StateObject private var viewModel = LeagueViewModel()
    @StateObject private var favoritesManager = FavoritesManager.shared
    
    var favoriteLeagues: [League] {
        viewModel.leagues.filter { favoritesManager.isFavorite($0.id) }
    }
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color(.black)
                    .ignoresSafeArea()
                
                if viewModel.isLoading {
                    ProgressView()
                        .tint(.white)
                } else if favoriteLeagues.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "star.fill")
                            .font(.system(size: 50))
                            .foregroundColor(.gray)
                        Text("No tienes ligas favoritas")
                            .font(.headline)
                            .foregroundColor(.white)
                        Text("Marca la estrella en cualquier liga para agregarla a favoritos")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                    }
                } else {
                    ScrollView {
                        LazyVStack(spacing: 12) {
                            ForEach(favoriteLeagues) { league in
                                NavigationLink(destination: LeagueDetailView(league: league)) {
                                    LeagueRowView(league: league, favoritesManager: favoritesManager)
                                }
                            }
                        }
                        .padding(.horizontal)
                    }
                }
            }
            .navigationTitle("Favoritos")
            .toolbarTitleDisplayMode(.inline)
            .foregroundColor(.white)
        }
        .onAppear {
            if viewModel.leagues.isEmpty {
                viewModel.fetchLeagues()
            }
        }
    }
}

#Preview {
    FavoritesView()
} 