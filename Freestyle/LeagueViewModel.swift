import Foundation

@MainActor
class LeagueViewModel: ObservableObject {
    @Published var leagues: [League] = []
    @Published var isLoading = false
    @Published var error: String?
    
    let apiURL = "https://web-production-2277.up.railway.app/api/tabla"
    
    func fetchLeagues() {
        guard let url = URL(string: "https://web-production-2277.up.railway.app/api/tabla") else {
            print("Invalid URL")
            return
        }
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                print("Error fetching leagues: \(error)")
                return
            }
            
            guard let data = data else {
                print("No data received")
                return
            }
            
            do {
                if let json = try JSONSerialization.jsonObject(with: data) as? [[String: Any]] {
                    var processedLeagues: [League] = []
                    
                    for leagueData in json {
                        guard let name = leagueData["name"] as? String,
                              let entriesData = leagueData["entries"] as? [[String: Any]] else {
                            print("Invalid league data format")
                            continue
                        }
                        
                        var entries: [Entry] = []
                        
                        for entryData in entriesData {
                            // Extract entry data from _doc field if available, otherwise use the entry data directly
                            let entryDict = entryData["_doc"] as? [String: Any] ?? entryData
                            
                            guard let position = entryDict["position"] as? Int,
                                  let name = entryDict["name"] as? String,
                                  let matches = entryDict["matches"] as? Int,
                                  let points = entryDict["points"] as? Int,
                                  let bg = entryDict["bg"] as? Int,
                                  let bd = entryDict["bd"] as? Int else {
                                print("Invalid entry data format")
                                continue
                            }
                            
                            let entry = Entry(
                                id: entryDict["_id"] as? String ?? name,
                                position: position,
                                name: name,
                                matches: matches,
                                points: points,
                                bg: bg,
                                bd: bd
                            )
                            entries.append(entry)
                        }
                        
                        let icon = leagueData["icon"] as? String ?? "fms_logo"
                        let createdAt = leagueData["createdAt"] as? String ?? ""
                        let updatedAt = leagueData["updatedAt"] as? String ?? ""
                        
                        let league = League(
                            id: leagueData["_id"] as? String ?? name,
                            name: name,
                            entries: entries,
                            icon: icon,
                            createdAt: createdAt,
                            updatedAt: updatedAt
                        )
                        processedLeagues.append(league)
                    }
                    
                    DispatchQueue.main.async {
                        self.leagues = processedLeagues
                        print("Successfully processed \(processedLeagues.count) leagues")
                    }
                } else {
                    print("Invalid JSON format")
                }
            } catch {
                print("Error parsing JSON: \(error)")
            }
        }.resume()
    }
} 