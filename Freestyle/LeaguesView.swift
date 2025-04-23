import SwiftUI

struct LeaguesView: View {
    var body: some View {
        NavigationStack {
            VStack {
                Text("Leagues")
                    .font(.title)
            }
            .navigationTitle("Leagues")
        }
    }
}

#Preview {
    LeaguesView()
} 