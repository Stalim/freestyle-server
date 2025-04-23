import SwiftUI

struct EventsView: View {
    @StateObject private var viewModel = EventViewModel()
    
    var body: some View {
        NavigationStack {
            ScrollView {
                if viewModel.isLoading {
                    ProgressView()
                        .padding()
                } else if let error = viewModel.error {
                    VStack {
                        Image(systemName: "exclamationmark.triangle")
                            .font(.largeTitle)
                            .foregroundColor(.red)
                        Text(error)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding()
                        Button("Try Again") {
                            viewModel.fetchEvents()
                        }
                        .buttonStyle(.bordered)
                    }
                    .padding()
                } else {
                    LazyVStack(spacing: 16) {
                        ForEach(viewModel.events) { event in
                            EventCard(event: event)
                        }
                    }
                    .padding(.vertical)
                }
            }
            .refreshable {
                await viewModel.fetchEvents()
            }
            .navigationTitle("Próximos Eventos")
            .toolbarTitleDisplayMode(.inline)
        }
        .onAppear {
            if viewModel.events.isEmpty {
                viewModel.fetchEvents()
            }
        }
    }
}

#Preview {
    EventsView()
} 