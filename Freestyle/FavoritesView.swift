import SwiftUI

struct FavoritesView: View {
    var body: some View {
        NavigationStack {
            VStack {
                Text("Favorites")
                    .font(.title)
            }
            .navigationTitle("Favorites")
        }
    }
}

#Preview {
    FavoritesView()
} 