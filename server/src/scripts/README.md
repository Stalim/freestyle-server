# Knockout Stage Scripts

This directory contains scripts for managing knockout stages in the application.

## Available Scripts

### 1. `populateKnockout.js`

This is the main script you should use. It:
- Checks if knockout stages exist for FMS Internacional and Red Bull Internacional
- Creates them if they don't exist
- Updates match results with sample data

**Usage:**
```bash
node src/scripts/populateKnockout.js
```

### 2. `checkAndCreateKnockout.js`

This script only checks if knockout stages exist and creates them if they don't.

**Usage:**
```bash
node src/scripts/checkAndCreateKnockout.js
```

### 3. `updateKnockoutResults.js`

This script only updates match results for existing knockout stages.

**Usage:**
```bash
node src/scripts/updateKnockoutResults.js
```

## Customizing Match Results

To customize match results, edit the `matchResults` array in the script files. Each match result should have:

```javascript
{
  leagueId: 'league_id',  // e.g., 'fms_internacional'
  matchId: 'match_id',    // e.g., 'fms_qf_1'
  winnerId: 'player_id',  // e.g., 'aczino'
  score1: 3,              // Score for competitor1
  score2: 1               // Score for competitor2
}
```

## How It Works

1. The script first checks if knockout stages exist for the specified leagues
2. If they don't exist, it creates them with initial data
3. Then it updates match results, which automatically advances winners to the next round

The knockout system is designed to automatically:
- Update match results
- Advance winners to the next round
- Update the current round when all matches in a round are complete

## Notes

- Make sure the server is running before executing these scripts
- The server URL is set to `http://localhost:3001` by default
- Match IDs must match the IDs defined in the knockout stage data 