# iFree API Documentation

## Project Structure
```
/
├── freestyle-server/    # Backend server code
│   ├── src/            # Source files
│   ├── uploads/        # Uploaded files storage
│   └── package.json    # Server dependencies
├── Freestyle/          # iOS app code
└── README.md          # This file
```

## Base URL
```
https://web-production-2277.up.railway.app
```

## Quick Start 🚀

All endpoints are accessible without authentication. Just make sure to:
1. Use the correct HTTP method (GET, POST, etc.)
2. Send data in JSON format when required
3. Use multipart/form-data for file uploads

## Available Endpoints 📚

### Health Check
```
GET /test
```
Check if the server and database are running.

### Players
```
GET    /api/players          # Get all players
GET    /api/players/:id      # Get player by ID
POST   /api/players          # Create new player
DELETE /api/players/:id      # Delete player
```

### Tournaments (Knockout)
```
GET    /api/knockout                         # Get all tournaments
GET    /api/knockout/:leagueId              # Get tournament by league
POST   /api/knockout/:leagueId/populate     # Create/update tournament
PATCH  /api/knockout/:leagueId/match/:id    # Update match result
PATCH  /api/knockout/:leagueId/reset/:round # Reset tournament round
```

### Rankings (Tabla)
```
GET /api/tabla      # Get all rankings
GET /api/tabla/:name # Get specific ranking
```

### Events
```
GET /api/events/:id # Get event details
```

## Common Request Examples 📝

### Create a Player
```json
POST /api/players
Content-Type: multipart/form-data

{
  "playerData": {
    "id": "player-id",
    "name": "Player Name",
    "age": 25,
    "nationality": "España",
    "rapStyle": "Technical",
    "stats": {
      "wins": 10,
      "losses": 5,
      "draws": 2,
      "winRate": 58
    },
    "achievements": ["Achievement 1"],
    "description": "Player bio"
  },
  "profileImage": [file],
  "bannerImage": [file]
}
```

### Populate Tournament
```json
POST /api/knockout/redbull_internacional/populate
Content-Type: application/json

{
  "participants": [
    {
      "id": "aczino",
      "name": "Aczino",
      "flag": "🇲🇽"
    }
    // ... 7 more participants (total 8 required)
  ]
}
```

### Update Match Result
```json
PATCH /api/knockout/redbull_internacional/match/123
Content-Type: application/json

{
  "winnerId": "aczino",
  "score1": 3,
  "score2": 1
}
```

## Response Examples 📤

### Player Response
```json
{
  "id": "aczino",
  "name": "Aczino",
  "imageUrl": "/uploads/aczino.jpg",
  "bannerUrl": "/uploads/aczino-banner.jpg",
  "age": 31,
  "nationality": "México",
  "rapStyle": "Punchline / Técnico",
  "stats": {
    "wins": 150,
    "losses": 20,
    "draws": 5,
    "winRate": 84
  },
  "achievements": [
    "3x FMS Internacional Champion",
    "2x Red Bull Internacional Champion"
  ],
  "description": "One of the most successful freestylers..."
}
```

### Tournament Response
```json
{
  "leagueId": "redbull_internacional",
  "title": "Red Bull Batalla Internacional - Final",
  "rounds": [
    {
      "name": "Cuartos de Final",
      "matches": [
        {
          "id": "QF1",
          "date": "2024-03-20T18:00:00Z",
          "competitor1": {
            "id": "aczino",
            "name": "Aczino",
            "flag": "🇲🇽"
          },
          "competitor2": {
            "id": "chuty",
            "name": "Chuty",
            "flag": "🇪🇸"
          },
          "winner": null,
          "score1": 0,
          "score2": 0
        }
      ]
    }
  ],
  "currentRound": 0
}
```

## Error Handling ⚠️

The API returns standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Server Error

Error responses include a message:
```json
{
  "message": "Error description",
  "error": "Detailed error info"
}
```

## File Upload Rules 📁

- Supported formats: jpeg, jpg, png, gif
- Files are stored in /uploads
- Access files via: `/uploads/filename.jpg`

## Development 💻

### Server Development

To run the server locally:
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables in `.env`:
   ```
   MONGODB_URI=your_mongodb_uri
   PORT=3001
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

The server will be available at `http://localhost:3001`

### iOS App Development

To develop the app locally:

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Open iOS simulator
npm run ios

# Open Android emulator
npm run android
```

## Features

- Events calendar with event details
- Leagues and tournament brackets
- Dark/light mode support
- Player profiles and statistics 

# iFree App

A mobile application for freestyle rap events and tournaments.

## Building the iOS App with GitHub Actions

This repository is configured to build the iOS app automatically using GitHub Actions, bypassing the Expo EAS build service limits.

### How it Works

1. **Local Build on GitHub Runners**: Instead of using Expo's build service (which has monthly limits on the free tier), the workflow builds the app directly on GitHub's macOS runners.

2. **The Process**:
   - Checks out the repository code
   - Sets up Node.js, Ruby, and Xcode environments
   - Installs all necessary dependencies
   - Generates native iOS code using `expo prebuild`
   - Installs CocoaPods dependencies
   - Builds the app using `xcodebuild`
   - Creates a tarball (.tar.gz) of the build files
   - Uploads the build using GitHub's REST API

3. **Downloading the Build**:
   - Go to the "Actions" tab in the GitHub repository
   - Select the most recent workflow run
   - Scroll down to the "Artifacts" section
   - Download the "ios-build" artifact
   - Extract the .tar.gz file to access the iOS app

### Requirements

- A GitHub repository
- An Expo token stored as a repository secret (EXPO_TOKEN)

### Setup Instructions

1. **Expo Token**:
   - Visit [Expo Access Tokens](https://expo.dev/settings/access-tokens)
   - Create a new token
   - Go to your GitHub repository's Settings > Secrets > Actions
   - Add a new repository secret named `EXPO_TOKEN` with the value of your Expo token

2. **Trigger a Build**:
   - Push to the repository to trigger the workflow automatically
   - Monitor the build in the "Actions" tab

### Troubleshooting

If you encounter build issues:
- Check that your Expo token is correctly set in the repository secrets
- Ensure all necessary environment variables are properly configured
- Review the workflow logs for any error messages
- Verify that your app.json configuration is correct
- Make sure the built files are properly listed in the "List built files in directory" step
- If the artifact doesn't appear, check the output of the upload step for any errors

## Development

To develop the app locally:

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Open iOS simulator
npm run ios

# Open Android emulator
npm run android
```

## Features

- Events calendar with event details
- Leagues and tournament brackets
- Dark/light mode support
- Player profiles and statistics 