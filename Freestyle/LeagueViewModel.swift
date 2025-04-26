import Foundation

@MainActor
class LeagueViewModel: ObservableObject {
    @Published var leagues: [League] = []
    @Published var isLoading = false
    @Published var error: String?
    
    let baseURL = "https://web-production-2277.up.railway.app/api/tabla"
    
    func fetchLeagues() {
        fetchData(from: baseURL)
    }
    
    func fetchSingleLeague(name: String) {
        let url = "\(baseURL)/\(name)"
        fetchData(from: url, isSingleLeague: true)
    }
    
    private func fetchData(from urlString: String, isSingleLeague: Bool = false) {
        guard let url = URL(string: urlString) else {
            print("Invalid URL: \(urlString)")
            return
        }
        
        isLoading = true
        print("Fetching from: \(urlString)")
        
        URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            guard let self = self else { return }
            
            if let error = error {
                print("Error fetching data: \(error)")
                DispatchQueue.main.async {
                    self.error = error.localizedDescription
                    self.isLoading = false
                }
                return
            }
            
            guard let data = data else {
                print("No data received")
                DispatchQueue.main.async {
                    self.error = "No data received"
                    self.isLoading = false
                }
                return
            }
            
            // Print raw response for debugging
            if let jsonString = String(data: data, encoding: .utf8) {
                print("Raw API Response: \(jsonString)")
            }
            
            do {
                if isSingleLeague {
                    // For single league endpoint
                    if let league = try? JSONDecoder().decode(League.self, from: data) {
                        DispatchQueue.main.async {
                            self.leagues = [league]
                            self.isLoading = false
                            print("Successfully processed single league: \(league.name)")
                        }
                        return
                    }
                    
                    // Fallback to manual parsing for single league
                    if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                       let name = json["name"] as? String,
                       let entries = json["entries"] as? [[String: Any]] {
                        let league = try self.processLeague(name: name, entries: entries)
                        DispatchQueue.main.async {
                            self.leagues = [league]
                            self.isLoading = false
                            print("Successfully processed single league: \(name)")
                        }
                    }
                } else {
                    // For all leagues endpoint
                    if let leaguesArray = try? JSONDecoder().decode([League].self, from: data) {
                        DispatchQueue.main.async {
                            self.leagues = leaguesArray
                            self.isLoading = false
                            print("Successfully processed \(leaguesArray.count) leagues from array")
                        }
                        return
                    }
                    
                    // Fallback to manual parsing for all leagues
                    if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                        var processedLeagues: [League] = []
                        
                        for (leagueName, entriesData) in json {
                            guard let entriesArray = entriesData as? [[String: Any]] else {
                                print("Invalid entries format for league: \(leagueName)")
                                continue
                            }
                            print("Processing league: \(leagueName) with \(entriesArray.count) entries")
                            
                            let league = try self.processLeague(name: leagueName, entries: entriesArray)
                            processedLeagues.append(league)
                        }
                        
                        DispatchQueue.main.async {
                            self.leagues = processedLeagues
                            self.isLoading = false
                            print("Successfully processed \(processedLeagues.count) leagues")
                        }
                    }
                }
            } catch {
                print("Error parsing JSON: \(error)")
                DispatchQueue.main.async {
                    self.error = error.localizedDescription
                    self.isLoading = false
                }
            }
        }.resume()
    }
    
    private func processLeague(name: String, entries: [[String: Any]]) throws -> League {
        var processedEntries: [Entry] = []
        
        for entryData in entries {
            guard let position = entryData["position"] as? Int,
                  let name = entryData["name"] as? String,
                  let matches = entryData["matches"] as? Int,
                  let points = entryData["points"] as? Int else {
                print("Invalid entry data format: \(entryData)")
                continue
            }
            
            let bg = entryData["bg"] as? Int ?? 0
            let bd = entryData["bd"] as? Int ?? 0
            let id = entryData["_id"] as? String ?? name
            
            let entry = Entry(
                id: id,
                position: position,
                name: name,
                matches: matches,
                points: points,
                bg: bg,
                bd: bd
            )
            processedEntries.append(entry)
            print("Added entry: \(name) at position \(position)")
        }
        
        return League(
            id: name,
            name: name,
            entries: processedEntries.sorted(by: { $0.position < $1.position }),
            icon: name,
            createdAt: "",
            updatedAt: ""
        )
    }
} 