import SwiftUI

struct EventCard: View {
    let event: Event
    
    private var formattedDate: String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        if let date = dateFormatter.date(from: event.date) {
            dateFormatter.dateFormat = "MMM d, yyyy"
            return dateFormatter.string(from: date)
        }
        return event.date
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Image with better error handling
            AsyncImage(url: URL(string: event.image)) { phase in
                switch phase {
                case .empty:
                    ProgressView()
                        .frame(height: 200)
                        .frame(maxWidth: .infinity)
                        .background(Color.gray.opacity(0.3))
                case .success(let image):
                image
                    .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(height: 200)
                        .frame(maxWidth: .infinity)
                        .background(Color.black.opacity(0.1))
                case .failure:
                    Image(systemName: "photo")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
            .frame(height: 200)
                        .frame(maxWidth: .infinity)
                        .background(Color.gray.opacity(0.3))
                        .foregroundColor(.gray)
                @unknown default:
                    EmptyView()
                }
            }
            
            // Content
            VStack(alignment: .leading, spacing: 8) {
                Text(event.title)
                    .font(.title2)
                    .fontWeight(.bold)
                
                HStack {
                    Image(systemName: "calendar")
                    Text(formattedDate)
                    Image(systemName: "clock")
                    Text(event.time.trimmingCharacters(in: .whitespaces))
                }
                .foregroundColor(.gray)
                
                HStack {
                    Image(systemName: "location")
                    Text(event.location.trimmingCharacters(in: .whitespaces))
                }
                .foregroundColor(.gray)
                
                Text(event.description.trimmingCharacters(in: .whitespaces))
                    .font(.body)
                    .lineLimit(3)
                    .foregroundColor(.secondary)
            }
            .padding(.horizontal)
            .padding(.bottom)
        }
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 5)
        .padding(.horizontal)
    }
} 