//
//  ContentView.swift
//  Freestyle
//
//  Created by Stalim Rivero on 4/23/25.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            EventsView()
                .tabItem {
                    Label("Events", systemImage: "calendar")
                }
            
            LeaguesView()
                .tabItem {
                    Label("Leagues", systemImage: "trophy")
                }
            
            FavoritesView()
                .tabItem {
                    Label("Favorites", systemImage: "star")
                }
            
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gear")
                }
        }
    }
}

#Preview {
    ContentView()
}
