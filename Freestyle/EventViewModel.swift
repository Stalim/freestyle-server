import Foundation

@MainActor
class EventViewModel: ObservableObject {
    @Published var events: [Event] = []
    @Published var isLoading = false
    @Published var error: String?
    
    let apiURL = "https://web-production-2277.up.railway.app/api/events"
    
    func fetchEvents() {
        isLoading = true
        error = nil
        
        guard let url = URL(string: apiURL) else {
            error = "Invalid URL"
            isLoading = false
            return
        }
        
        Task {
            do {
                let (data, response) = try await URLSession.shared.data(from: url)
                
                // Print response for debugging
                if let httpResponse = response as? HTTPURLResponse {
                    print("HTTP Status Code: \(httpResponse.statusCode)")
                }
                
                // Print received data for debugging
                if let jsonString = String(data: data, encoding: .utf8) {
                    print("Received JSON: \(jsonString)")
                }
                
                let decoder = JSONDecoder()
                decoder.keyDecodingStrategy = .convertFromSnakeCase // In case API uses snake_case
                let decodedEvents = try decoder.decode([Event].self, from: data)
                self.events = decodedEvents
                self.isLoading = false
            } catch {
                print("Decoding Error: \(error)")
                self.error = "Error: \(error.localizedDescription)"
                self.isLoading = false
            }
        }
    }
} 