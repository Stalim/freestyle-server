import SwiftUI

struct SettingsView: View {
    var body: some View {
        NavigationStack {
            VStack {
                Text("Settings")
                    .font(.title)
            }
            .navigationTitle("Settings")
        }
    }
}

#Preview {
    SettingsView()
} 