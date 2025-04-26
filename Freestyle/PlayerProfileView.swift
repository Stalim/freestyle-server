import SwiftUI

struct PlayerProfileView: View {
    let entry: Entry
    let leagueName: String
    @StateObject private var viewModel = PlayerProfileViewModel()
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            ScrollView {
                if viewModel.isLoading {
                    ProgressView()
                        .tint(.white)
                        .padding()
                } else if let error = viewModel.error {
                    VStack {
                        Image(systemName: "exclamationmark.triangle")
                            .font(.largeTitle)
                            .foregroundColor(.red)
                        Text(error)
                            .foregroundColor(.white)
                            .multilineTextAlignment(.center)
                            .padding()
                    }
                } else if let profile = viewModel.profile {
                    VStack(spacing: 20) {
                        // Banner Image
                        AsyncImage(url: URL(string: profile.fullBannerUrl)) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Rectangle()
                                .fill(Color.gray.opacity(0.3))
                        }
                        .frame(height: 200)
                        .clipped()
                        
                        // Profile Image
                        AsyncImage(url: URL(string: profile.fullImageUrl)) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Image(systemName: "person.circle.fill")
                        }
                        .frame(width: 120, height: 120)
                        .clipShape(Circle())
                        .overlay(Circle().stroke(Color.white, lineWidth: 4))
                        .shadow(radius: 7)
                        .offset(y: -60)
                        .padding(.bottom, -60)
                        
                        // Profile Info
                        VStack(spacing: 16) {
                            Text(profile.name)
                                .font(.title2)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                            // Basic Info Section
                            HStack(spacing: 20) {
                                VStack {
                                    Text("\(profile.age)")
                                        .font(.headline)
                                        .foregroundColor(.white)
                                    Text("Edad")
                                        .font(.caption)
                                        .foregroundColor(.gray)
                                }
                                
                                VStack {
                                    Text(profile.nationality)
                                        .font(.headline)
                                        .foregroundColor(.white)
                                    Text("País")
                                        .font(.caption)
                                        .foregroundColor(.gray)
                                }
                                
                                VStack {
                                    Text(profile.rapStyle)
                                        .font(.headline)
                                        .foregroundColor(.white)
                                    Text("Estilo")
                                        .font(.caption)
                                        .foregroundColor(.gray)
                                }
                            }
                            .padding()
                            
                            // Career Stats Section
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Estadísticas de Carrera")
                                    .font(.title3)
                                    .fontWeight(.bold)
                                    .foregroundColor(.white)
                                    .padding(.horizontal)
                                
                                VStack(spacing: 8) {
                                    StatRow(title: "Victorias", value: "\(profile.stats.wins)")
                                    StatRow(title: "Derrotas", value: "\(profile.stats.losses)")
                                    StatRow(title: "Empates", value: "\(profile.stats.draws)")
                                    StatRow(title: "% Victoria", value: String(format: "%.1f%%", profile.stats.winRate))
                                }
                                .padding()
                                .background(Color.gray.opacity(0.2))
                                .cornerRadius(12)
                                .padding(.horizontal)
                            }
                            
                            // Current League Stats
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Estadísticas Actuales")
                                    .font(.title3)
                                    .fontWeight(.bold)
                                    .foregroundColor(.white)
                                    .padding(.horizontal)
                                
                                VStack(spacing: 8) {
                                    StatRow(title: "Posición", value: "\(entry.position)")
                                    StatRow(title: "Batallas", value: "\(entry.battlesDisputed)")
                                    StatRow(title: "Puntos", value: "\(entry.points)")
                                    StatRow(title: "Batallas Ganadas", value: "\(entry.wonBattles)")
                                    StatRow(title: "Batallas Perdidas", value: "\(entry.lostBattles)")
                                }
                                .padding()
                                .background(Color.gray.opacity(0.2))
                                .cornerRadius(12)
                                .padding(.horizontal)
                            }
                            
                            // Achievements Section
                            if !profile.achievements.isEmpty {
                                VStack(alignment: .leading, spacing: 12) {
                                    Text("Logros")
                                        .font(.title3)
                                        .fontWeight(.bold)
                                        .foregroundColor(.white)
                                        .padding(.horizontal)
                                    
                                    VStack(alignment: .leading, spacing: 8) {
                                        ForEach(profile.achievements, id: \.self) { achievement in
                                            HStack {
                                                Image(systemName: "trophy.fill")
                                                    .foregroundColor(.yellow)
                                                Text(achievement)
                                                    .foregroundColor(.white)
                                            }
                                        }
                                    }
                                    .padding()
                                    .background(Color.gray.opacity(0.2))
                                    .cornerRadius(12)
                                    .padding(.horizontal)
                                }
                            }
                            
                            // Description Section
                            if !profile.description.isEmpty {
                                VStack(alignment: .leading, spacing: 12) {
                                    Text("Descripción")
                                        .font(.title3)
                                        .fontWeight(.bold)
                                        .foregroundColor(.white)
                                        .padding(.horizontal)
                                    
                                    Text(profile.description)
                                        .foregroundColor(.gray)
                                        .padding()
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                        .background(Color.gray.opacity(0.2))
                                        .cornerRadius(12)
                                        .padding(.horizontal)
                                }
                            }
                        }
                        .padding(.top)
                    }
                } else {
                    // Fallback view when no profile is loaded
                    VStack(spacing: 16) {
                        Image(systemName: "person.circle.fill")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 100, height: 100)
                            .foregroundColor(.white)
                        
                        Text(entry.name)
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        // Current League Stats
                        VStack(spacing: 15) {
                            StatRow(title: "Current Position", value: "\(entry.position)")
                            StatRow(title: "Matches Played", value: "\(entry.battlesDisputed)")
                            StatRow(title: "Battles Won", value: "\(entry.wonBattles)")
                            StatRow(title: "Battles Lost", value: "\(entry.lostBattles)")
                            StatRow(title: "Current Points", value: "\(entry.points)")
                        }
                        .padding()
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(12)
                        .padding(.horizontal)
                    }
                }
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            viewModel.loadPlayerProfile(name: entry.name)
        }
    }
}

struct StatRow: View {
    let title: String
    let value: String
    
    var body: some View {
        HStack {
            Text(title)
                .foregroundColor(.gray)
            Spacer()
            Text(value)
                .foregroundColor(.white)
                .fontWeight(.semibold)
        }
    }
}

// Add mock data for preview
class MockPlayerProfileViewModel: PlayerProfileViewModel {
    override init() {
        super.init()
        self.profile = Player(
            id: "mock_id",
            name: "Example Player",
            imageUrl: "https://example.com/image.jpg",
            bannerUrl: "https://example.com/banner.jpg",
            age: 25,
            nationality: "España",
            rapStyle: "Punchline",
            stats: PlayerStats(
                wins: 18,
                losses: 6,
                draws: 2,
                winRate: 75.0
            ),
            achievements: [
                "Campeón FMS España 2023",
                "Subcampeón Red Bull 2022"
            ],
            description: "Un freestyler con estilo único y flow incomparable.",
            createdAt: "2024-03-14T00:00:00.000Z",
            updatedAt: "2024-03-14T00:00:00.000Z"
        )
    }
}

#Preview {
    NavigationView {
        PlayerProfileView(
            entry: Entry(
                id: "preview",
                position: 1,
                name: "Example Player",
                battlesDisputed: 8,
                points: 24,
                wonBattles: 6,
                lostBattles: 2
            ),
            leagueName: "FMS Argentina"
        )
    }
} 