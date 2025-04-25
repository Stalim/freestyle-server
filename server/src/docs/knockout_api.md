# Knockout API Documentation

This document describes the API endpoints for managing knockout stages in the application.

## Base URL

```
http://localhost:3001/api/knockout
```

## Endpoints

### 1. Get All Knockout Stages

**GET** `/`

Returns all knockout stages in the database.

### 2. Get Knockout Stage for a League

**GET** `/:leagueId`

Returns the knockout stage for a specific league.

**Parameters:**
- `leagueId` (path parameter): ID of the league (e.g., `fms_internacional`, `redbull_internacional`, `rdi`)

### 3. Create or Replace Knockout Stage

**POST** `/:leagueId`

Creates or replaces a knockout stage for a specific league.

**Parameters:**
- `leagueId` (path parameter): ID of the league
- Request body: JSON object with `title` and `rounds` properties

### 4. Populate Tournament Bracket with Custom Participants

**POST** `/:leagueId/populate`

Populates a tournament bracket for a specific league with custom participants for the quarter-finals.

**Parameters:**
- `leagueId` (path parameter): ID of the league (e.g., `fms_internacional`, `redbull_internacional`, `rdi`)
- Request body: JSON object with `participants` array

**Request Body Example:**
```json
{
  "participants": [
    {
      "id": "aczino",
      "name": "Aczino",
      "flag": "🇲🇽",
      "imageUrl": "/uploads/aczino.jpg"
    },
    {
      "id": "chuty",
      "name": "Chuty",
      "flag": "🇪🇸",
      "imageUrl": "/uploads/chuty.jpg"
    },
    {
      "id": "skone",
      "name": "Skone",
      "flag": "🇪🇸",
      "imageUrl": "/uploads/skone.jpg"
    },
    {
      "id": "wos",
      "name": "WOS",
      "flag": "🇦🇷",
      "imageUrl": "/uploads/wos.jpg"
    },
    {
      "id": "dtoke",
      "name": "Dtoke",
      "flag": "🇦🇷",
      "imageUrl": "/uploads/dtoke.jpg"
    },
    {
      "id": "bnet",
      "name": "Bnet",
      "flag": "🇪🇸",
      "imageUrl": "/uploads/bnet.jpg"
    },
    {
      "id": "gazir",
      "name": "Gazir",
      "flag": "🇪🇸",
      "imageUrl": "/uploads/gazir.jpg"
    },
    {
      "id": "kaiser",
      "name": "Kaiser",
      "flag": "🇨🇱",
      "imageUrl": "/uploads/kaiser.jpg"
    }
  ]
}
```

**Notes:**
- You must provide exactly 8 participants for the quarter-finals.
- Each participant must have at least `id` and `name` properties.
- `flag` and `imageUrl` are optional but recommended for better visualization.
- The endpoint will automatically create the tournament structure with quarter-finals, semi-finals, and finals.
- The endpoint will delete any existing knockout stage for the specified league.

### 5. Update Match Result

**PATCH** `/:leagueId/match/:matchId`

Updates the result of a match and advances the winner to the next round.

**Parameters:**
- `leagueId` (path parameter): ID of the league
- `matchId` (path parameter): ID of the match
- Request body: JSON object with `winnerId`, `score1`, and `score2` properties

**Request Body Example:**
```json
{
  "winnerId": "aczino",
  "score1": 3,
  "score2": 1
}
```

### 6. Reset a Round

**PATCH** `/:leagueId/reset/:roundIndex`

Resets a round and all subsequent rounds.

**Parameters:**
- `leagueId` (path parameter): ID of the league
- `roundIndex` (path parameter): Index of the round to reset (0 for quarter-finals, 1 for semi-finals, 2 for finals)

## Using with Postman

### Setting up a request to populate a tournament bracket:

1. Create a new POST request in Postman
2. Set the URL to `http://localhost:3001/api/knockout/{leagueId}/populate` (replace `{leagueId}` with your league ID)
3. Go to the "Body" tab
4. Select "raw" and "JSON" format
5. Enter the JSON body with your participants (see example above)
6. Click "Send"

### Example for populating the RDI tournament:

**URL:** `http://localhost:3001/api/knockout/rdi/populate`

**Body:**
```json
{
  "participants": [
    {
      "id": "yartzi",
      "name": "Yartzi",
      "flag": "🇵🇷",
      "imageUrl": "/uploads/yartzi.jpg"
    },
    {
      "id": "elevn",
      "name": "Elevn",
      "flag": "🇩🇴",
      "imageUrl": "/uploads/elevn.jpg"
    },
    {
      "id": "valles-t",
      "name": "Valles-T",
      "flag": "🇨🇴",
      "imageUrl": "/uploads/valles-t.jpg"
    },
    {
      "id": "shadow",
      "name": "Shadow",
      "flag": "🇩🇴",
      "imageUrl": "/uploads/shadow.jpg"
    },
    {
      "id": "letra",
      "name": "Letra",
      "flag": "🇲🇽",
      "imageUrl": "/uploads/letra.jpg"
    },
    {
      "id": "jaze",
      "name": "Jaze",
      "flag": "🇵🇪",
      "imageUrl": "/uploads/jaze.jpg"
    },
    {
      "id": "nitro",
      "name": "Nitro",
      "flag": "🇨🇱",
      "imageUrl": "/uploads/nitro.jpg"
    },
    {
      "id": "stick",
      "name": "Stick",
      "flag": "🇨🇱",
      "imageUrl": "/uploads/stick.jpg"
    }
  ]
}
``` 