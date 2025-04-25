# Freestyle Rap App Server

This is the backend server for the Freestyle Rap App, providing APIs for leagues, events, and player profiles.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the server directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/freestyle-app
   PORT=3000
   ```

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Player API

The Player API provides endpoints to manage freestyle rapper profiles.

#### Get all players
```
GET /api/players
```

#### Get a specific player
```
GET /api/players/:id
```

#### Create a new player
```
POST /api/players
```

Request body example:
```json
{
  "id": "player-id",
  "name": "Player Name",
  "imageUrl": "https://example.com/image.jpg",
  "bannerUrl": "https://example.com/banner.jpg",
  "age": 25,
  "nationality": "España",
  "rapStyle": "Technical / Punchline",
  "stats": {
    "wins": 10,
    "losses": 5,
    "draws": 2,
    "winRate": 58
  },
  "achievements": [
    "Achievement 1",
    "Achievement 2"
  ],
  "description": "Player bio description"
}
```

#### Update a player
```
PUT /api/players/:id
```

#### Delete a player
```
DELETE /api/players/:id
```

## Seed Data

To populate the database with sample player data:

```
npm run seed:players
```

This will add profiles for well-known freestyle rappers like Aczino, Chuty, Skone, WOS, and others.

## Client Integration

The client application can use the `playerService.ts` to interact with these endpoints. The service provides methods for fetching, creating, updating, and deleting player data. 