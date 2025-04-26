import SwiftUI

struct LeagueDetailView: View {
    let league: League
    @StateObject private var viewModel = LeagueViewModel()
    
    // Add computed property for random BG numbers
    private func getRandomBG(for entry: Entry) -> Int {
        if league.name == "fms_espana" {
            return Int.random(in: 0...entry.matches)
        }
        return entry.battlesWon
    }
    
    var leagueLogo: String {
        switch league.name {
        case "fms_bolivia":
            return "fms_bolivia"
        case "fms_argentina":
            return "fms_argentina"
        case "fms_peru":
            return "fms_peru"
        case "fms_espana":
            return "fms_espana"
        case "fms_caribe":
            return "fms_caribe"
        case "fms_chile":
            return "fms_chile"
        case "fms_colombia":
            return "fms_colombia"
        case "fms_mexico":
            return "fms_mexico"
        case "FMS World Series":
            return "fmsws"
        default:
            return league.displayIcon
        }
    }
    
    var displayName: String {
        switch league.name {
        case "fms_bolivia":
            return "FMS BOLIVIA"
        case "fms_argentina":
            return "FMS ARGENTINA"
        case "fms_peru":
            return "FMS PERÚ"
        case "fms_espana":
            return "FMS ESPAÑA"
        case "fms_caribe":
            return "FMS CARIBE"
        case "fms_chile":
            return "FMS CHILE"
        case "fms_colombia":
            return "FMS COLOMBIA"
        case "fms_mexico":
            return "FMS MÉXICO"
        case "fms_world_series":
            return "FMS WORLD SERIES"
        default:
            return league.name.replacingOccurrences(of: "_", with: " ").uppercased()
        }
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // League Header Section
            HStack(spacing: 16) {
                Image(leagueLogo)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 60, height: 60)
                    .cornerRadius(8)
                
                Text(displayName)
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 20)
            .padding(.horizontal)
            .background(Color.black)
            
            // Table Section
            if viewModel.isLoading {
                ProgressView()
                    .tint(.white)
                    .padding()
            } else {
                List {
                    // Header Row
                    HStack(alignment: .center) {
                        Text("POS")
                            .font(.caption)
                            .frame(width: 30, alignment: .leading)
                        
                        Text("MC")
                            .font(.caption)
                        
                        Spacer()
                        
                        Text("BT")
                            .font(.caption)
                            .frame(width: 50, alignment: .trailing)
                        
                        Text("BG")
                            .font(.caption)
                            .frame(width: 50, alignment: .trailing)
                        
                        Text("BP")
                            .font(.caption)
                            .frame(width: 50, alignment: .trailing)
                        
                        Text("PTS")
                            .font(.caption)
                            .frame(width: 50, alignment: .trailing)
                    }
                    .padding(.vertical, 4)
                    .listRowBackground(Color.clear)
                    .foregroundColor(.white)
                    
                    ForEach(viewModel.leagues.first?.entries.sorted(by: { $0.position < $1.position }) ?? []) { entry in
                        ZStack {
                            NavigationLink(destination: PlayerProfileView(entry: entry, leagueName: league.name)) {
                                EmptyView()
                            }
                            .opacity(0)
                            
                            HStack {
                                Text("\(entry.position)")
                                    .font(.headline)
                                    .frame(width: 30, alignment: .leading)
                                
                                Text(entry.name)
                                    .font(.body)
                                
                                Spacer()
                                
                                Text("\(entry.battlesDisputed)")
                                    .font(.headline)
                                    .frame(width: 50, alignment: .trailing)
                                
                                Text("\(entry.wonBattles)")
                                    .font(.headline)
                                    .frame(width: 50, alignment: .trailing)
                                
                                Text("\(entry.lostBattles)")
                                    .font(.headline)
                                    .frame(width: 50, alignment: .trailing)
                                
                                Text("\(entry.points)")
                                    .font(.headline)
                                    .frame(width: 50, alignment: .trailing)
                            }
                            .padding(.vertical, 4)
                        }
                        .listRowBackground(Color.clear)
                        .foregroundColor(.white)
                    }
                }
                .listStyle(PlainListStyle())
                .background(Color.black)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            viewModel.fetchSingleLeague(name: league.name)
        }
    }
}

#Preview {
    NavigationView {
        LeagueDetailView(league: League(
            id: "fms_argentina",
            name: "fms_argentina",
            entries: [
                Entry(id: "1", position: 1, name: "Mecha", battlesDisputed: 10, points: 25, wonBattles: 7, lostBattles: 3),
                Entry(id: "2", position: 2, name: "Larrix", battlesDisputed: 10, points: 22, wonBattles: 7, lostBattles: 3),
                Entry(id: "3", position: 3, name: "Dybbuk", battlesDisputed: 10, points: 19, wonBattles: 6, lostBattles: 4),
                Entry(id: "4", position: 4, name: "Teorema", battlesDisputed: 10, points: 19, wonBattles: 6, lostBattles: 4),
                Entry(id: "5", position: 5, name: "Klan", battlesDisputed: 10, points: 18, wonBattles: 6, lostBattles: 4),
                Entry(id: "6", position: 6, name: "Stuart", battlesDisputed: 10, points: 18, wonBattles: 6, lostBattles: 4),
                Entry(id: "7", position: 7, name: "Jesse Pungaz", battlesDisputed: 10, points: 16, wonBattles: 5, lostBattles: 5),
                Entry(id: "8", position: 8, name: "CTZ", battlesDisputed: 10, points: 8, wonBattles: 3, lostBattles: 7),
                Entry(id: "9", position: 9, name: "Nasir Catriel", battlesDisputed: 10, points: 6, wonBattles: 2, lostBattles: 8),
                Entry(id: "10", position: 10, name: "Barto", battlesDisputed: 10, points: 0, wonBattles: 0, lostBattles: 10)
            ],
            icon: "fms_argentina",
            createdAt: "",
            updatedAt: ""
        ))
    }
} 