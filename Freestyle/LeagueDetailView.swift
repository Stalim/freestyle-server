import SwiftUI

struct LeagueDetailView: View {
    let league: League
    
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
            List {
                // Header Row
                HStack(alignment: .center) {
                    Text("POS")
                        .font(.caption)
                        .frame(width: 30, alignment: .leading)
                    
                    Text("MC")
                        .font(.caption)
                    
                    Spacer()
                    
                    Text("BD")
                        .font(.caption)
                        .frame(width: 50, alignment: .trailing)
                    
                    Text("BG")
                        .font(.caption)
                        .frame(width: 50, alignment: .trailing)
                    
                    Text("PTS")
                        .font(.caption)
                        .frame(width: 50, alignment: .trailing)
                }
                .padding(.vertical, 4)
                .listRowBackground(Color.clear)
                .foregroundColor(.white)
                
                ForEach(league.entries.sorted(by: { $0.position < $1.position })) { entry in
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
                            
                            Text("\(entry.matches)")
                                .font(.headline)
                                .frame(width: 50, alignment: .trailing)
                            
                            Text("\(entry.battlesLost)")
                                .font(.headline)
                                .frame(width: 50, alignment: .trailing)
                            
                            Text("\(entry.battlesWon)")
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
        .navigationBarTitleDisplayMode(.inline)
    }
} 