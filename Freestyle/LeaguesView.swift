import SwiftUI

struct LeaguesView: View {
    @StateObject private var viewModel = LeagueViewModel()
    @StateObject private var favoritesManager = FavoritesManager.shared
    @State private var searchText = ""
    
    var filteredLeagues: [League] {
        if searchText.isEmpty {
            return viewModel.leagues
        }
        return viewModel.leagues.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
    }
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color(.black)
                    .ignoresSafeArea()
                
                VStack(spacing: 16) {
                    // Enhanced Search Bar
                    HStack(spacing: 12) {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(.gray)
                            .font(.system(size: 18))
                        
                        TextField("", text: $searchText)
                            .foregroundColor(.white)
                            .font(.system(size: 17))
                            .placeholder(when: searchText.isEmpty) {
                                Text("Buscar ligas...")
                                    .foregroundColor(.gray)
                                    .font(.system(size: 17))
                            }
                        
                        if !searchText.isEmpty {
                            Button(action: {
                                searchText = ""
                            }) {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundColor(.gray)
                                    .font(.system(size: 16))
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color(.systemGray6).opacity(0.15))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                            )
                    )
                    .padding(.horizontal)
                    .padding(.top, 8)
                    
                    if viewModel.isLoading {
                        ProgressView()
                            .tint(.white)
                    } else {
                        ScrollView {
                            LazyVStack(spacing: 12) {
                                ForEach(filteredLeagues) { league in
                                    NavigationLink(destination: LeagueDetailView(league: league)) {
                                        LeagueRowView(league: league, favoritesManager: favoritesManager)
                                    }
                                }
                            }
                            .padding(.horizontal)
                        }
                        .refreshable {
                            await viewModel.fetchLeagues()
                        }
                    }
                }
            }
            .navigationTitle("Ligas")
            .toolbarTitleDisplayMode(.inline)
            .foregroundColor(.white)
        }
        .onAppear {
            if viewModel.leagues.isEmpty {
                Task {
                    await viewModel.fetchLeagues()
                }
            }
        }
    }
}

// Add ViewModifier for placeholder
extension View {
    func placeholder<Content: View>(
        when shouldShow: Bool,
        alignment: Alignment = .leading,
        @ViewBuilder placeholder: () -> Content) -> some View {
        
        ZStack(alignment: alignment) {
            placeholder().opacity(shouldShow ? 1 : 0)
            self
        }
    }
}

struct LeagueRowView: View {
    let league: League
    @ObservedObject var favoritesManager: FavoritesManager
    
    var displayName: String {
        switch league.name {
        case "fms_bolivia":
            return "FMS Bolivia"
        case "fms_argentina":
            return "FMS Argentina"
        case "fms_peru":
            return "FMS Perú"
        case "fms_espana":
            return "FMS España"
        case "fms_caribe":
            return "FMS Caribe"
        case "fms_chile":
            return "FMS Chile"
        case "fms_colombia":
            return "FMS Colombia"
        case "fms_mexico":
            return "FMS México"
        default:
            return league.name
        }
    }
    
    var body: some View {
        HStack {
            if league.name == "fms_bolivia" {
                Image("fms_bolivia")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 40, height: 40)
                    .cornerRadius(8)
            } else if league.name == "fms_argentina" {
                Image("fms_argentina")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 40, height: 40)
                    .cornerRadius(8)
            } else if league.name == "fms_peru" {
                Image("fms_peru")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 40, height: 40)
                    .cornerRadius(8)
            } else if league.name == "fms_espana" {
                Image("fms_espana")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 40, height: 40)
                    .cornerRadius(8)
            } else if league.name == "fms_caribe" {
                Image("fms_caribe")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 40, height: 40)
                    .cornerRadius(8)
            } else if league.name == "fms_chile" {
                Image("fms_chile")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 40, height: 40)
                    .cornerRadius(8)
            } else if league.name == "fms_colombia" {
                Image("fms_colombia")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 40, height: 40)
                    .cornerRadius(8)
            } else if league.name == "fms_mexico" {
                Image("fms_mexico")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 40, height: 40)
                    .cornerRadius(8)
            } else {
                Image(league.displayIcon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 40, height: 40)
                    .cornerRadius(20)
            }
            
            Text(displayName)
                .foregroundColor(.white)
                .font(.headline)
            
            Spacer()
            
            Button(action: {
                favoritesManager.toggleFavorite(for: league.id)
            }) {
                Image(systemName: favoritesManager.isFavorite(league.id) ? "star.fill" : "star")
                    .foregroundColor(favoritesManager.isFavorite(league.id) ? .yellow : .gray)
            }
        }
        .padding()
        .background(Color.gray.opacity(0.2))
        .cornerRadius(10)
    }
}

#Preview {
    LeaguesView()
} 