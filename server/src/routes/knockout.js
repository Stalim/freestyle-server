const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Knockout Schema
const knockoutSchema = new mongoose.Schema({
  leagueId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  rounds: [{
    name: { type: String, required: true }, // e.g., "Cuartos de Final", "Semifinales", "Final"
    matches: [{
      id: { type: String, required: true },
      date: { type: Date, required: true },
      competitor1: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        flag: { type: String }
      },
      competitor2: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        flag: { type: String }
      },
      winner: { type: String, default: null }, // ID of the winner, null if not decided
      score1: { type: Number, default: 0 },
      score2: { type: Number, default: 0 }
    }]
  }],
  currentRound: { type: Number, default: 0 } // Index of the current round
}, { timestamps: true });

const Knockout = mongoose.model('Knockout', knockoutSchema);

// GET all knockout stages
router.get('/', async (req, res) => {
  try {
    const knockouts = await Knockout.find();
    res.json(knockouts);
  } catch (error) {
    console.error('Error fetching knockout stages:', error);
    res.status(500).json({ message: 'Error fetching knockout stages', error: error.message });
  }
});

// GET knockout stage for a specific league
router.get('/:leagueId', async (req, res) => {
  try {
    const knockout = await Knockout.findOne({ leagueId: req.params.leagueId });
    if (!knockout) {
      return res.status(404).json({ message: 'Knockout stage not found for this league' });
    }
    res.json(knockout);
  } catch (error) {
    console.error('Error fetching knockout stage:', error);
    res.status(500).json({ message: 'Error fetching knockout stage', error: error.message });
  }
});

// POST create or replace knockout stage for a league
router.post('/:leagueId', async (req, res) => {
  try {
    const { title, rounds } = req.body;
    
    if (!title || !rounds || !Array.isArray(rounds)) {
      return res.status(400).json({ message: 'Invalid knockout data. Title and rounds array are required.' });
    }
    
    // Validate rounds data
    for (const round of rounds) {
      if (!round.name || !Array.isArray(round.matches)) {
        return res.status(400).json({ message: 'Each round must have a name and matches array' });
      }
      
      for (const match of round.matches) {
        if (!match.id || !match.date || !match.competitor1 || !match.competitor2) {
          return res.status(400).json({ message: 'Each match must have id, date, competitor1, and competitor2' });
        }
        
        if (!match.competitor1.id || !match.competitor1.name || !match.competitor2.id || !match.competitor2.name) {
          return res.status(400).json({ message: 'Each competitor must have id and name' });
        }
      }
    }
    
    // Delete existing knockout stage if it exists
    await Knockout.findOneAndDelete({ leagueId: req.params.leagueId });
    
    // Create new knockout stage
    const knockout = new Knockout({
      leagueId: req.params.leagueId,
      title,
      rounds,
      currentRound: 0
    });
    
    const savedKnockout = await knockout.save();
    res.status(201).json(savedKnockout);
  } catch (error) {
    console.error('Error creating knockout stage:', error);
    res.status(500).json({ message: 'Error creating knockout stage', error: error.message });
  }
});

// POST populate tournament bracket with custom participants
router.post('/:leagueId/populate', async (req, res) => {
  try {
    const { participants } = req.body;
    const leagueId = req.params.leagueId;
    
    // Validate participants data
    if (!participants || !Array.isArray(participants) || participants.length !== 8) {
      return res.status(400).json({ 
        message: 'Invalid participants data. Exactly 8 participants are required for quarter-finals.',
        received: participants ? participants.length : 0
      });
    }
    
    // Validate each participant
    for (const participant of participants) {
      if (!participant.id || !participant.name) {
        return res.status(400).json({ 
          message: 'Each participant must have id and name',
          invalidParticipant: participant
        });
      }
    }
    
    // Get league title based on leagueId
    let title;
    switch(leagueId) {
      case 'fms_internacional':
        title = 'FMS Internacional - Fase Final';
        break;
      case 'redbull_internacional':
        title = 'Red Bull Batalla Internacional - Final';
        break;
      case 'rdi':
        title = 'Red Bull Dominicana Internacional';
        break;
      default:
        title = `${leagueId.toUpperCase()} - Knockout Stage`;
    }
    
    // Create dates for matches
    const now = new Date();
    const quarterFinalDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
    const semiFinalDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);  // 2 weeks from now
    const finalDate = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);      // 3 weeks from now
    
    // Create rounds and matches
    const rounds = [
      {
        name: 'Cuartos de Final',
        matches: [
          {
            id: `${leagueId}_qf_1`,
            date: new Date(quarterFinalDate.getTime() + 0 * 60 * 60 * 1000), // Same day, different hours
            competitor1: {
              id: participants[0].id,
              name: participants[0].name,
              flag: participants[0].flag || ''
            },
            competitor2: {
              id: participants[1].id,
              name: participants[1].name,
              flag: participants[1].flag || ''
            },
            winner: null,
            score1: 0,
            score2: 0
          },
          {
            id: `${leagueId}_qf_2`,
            date: new Date(quarterFinalDate.getTime() + 1.5 * 60 * 60 * 1000),
            competitor1: {
              id: participants[2].id,
              name: participants[2].name,
              flag: participants[2].flag || ''
            },
            competitor2: {
              id: participants[3].id,
              name: participants[3].name,
              flag: participants[3].flag || ''
            },
            winner: null,
            score1: 0,
            score2: 0
          },
          {
            id: `${leagueId}_qf_3`,
            date: new Date(quarterFinalDate.getTime() + 3 * 60 * 60 * 1000),
            competitor1: {
              id: participants[4].id,
              name: participants[4].name,
              flag: participants[4].flag || ''
            },
            competitor2: {
              id: participants[5].id,
              name: participants[5].name,
              flag: participants[5].flag || ''
            },
            winner: null,
            score1: 0,
            score2: 0
          },
          {
            id: `${leagueId}_qf_4`,
            date: new Date(quarterFinalDate.getTime() + 4.5 * 60 * 60 * 1000),
            competitor1: {
              id: participants[6].id,
              name: participants[6].name,
              flag: participants[6].flag || ''
            },
            competitor2: {
              id: participants[7].id,
              name: participants[7].name,
              flag: participants[7].flag || ''
            },
            winner: null,
            score1: 0,
            score2: 0
          }
        ]
      },
      {
        name: 'Semifinales',
        matches: [
          {
            id: `${leagueId}_sf_1`,
            date: new Date(semiFinalDate.getTime() + 0 * 60 * 60 * 1000),
            competitor1: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            },
            competitor2: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            },
            winner: null,
            score1: 0,
            score2: 0
          },
          {
            id: `${leagueId}_sf_2`,
            date: new Date(semiFinalDate.getTime() + 2 * 60 * 60 * 1000),
            competitor1: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            },
            competitor2: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            },
            winner: null,
            score1: 0,
            score2: 0
          }
        ]
      },
      {
        name: 'Final',
        matches: [
          {
            id: `${leagueId}_final`,
            date: finalDate,
            competitor1: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            },
            competitor2: {
              id: 'tbd',
              name: 'TBD',
              flag: '🌎'
            },
            winner: null,
            score1: 0,
            score2: 0
          }
        ]
      }
    ];
    
    // Delete existing knockout stage if it exists
    await Knockout.findOneAndDelete({ leagueId });
    
    // Create new knockout stage
    const knockout = new Knockout({
      leagueId,
      title,
      rounds,
      currentRound: 0
    });
    
    const savedKnockout = await knockout.save();
    res.status(201).json({
      message: `Successfully populated tournament bracket for ${leagueId}`,
      data: savedKnockout
    });
  } catch (error) {
    console.error('Error populating tournament bracket:', error);
    res.status(500).json({ message: 'Error populating tournament bracket', error: error.message });
  }
});

// PATCH update match result and advance winners
router.patch('/:leagueId/match/:matchId', async (req, res) => {
  try {
    const { winnerId, score1, score2 } = req.body;
    
    if (!winnerId) {
      return res.status(400).json({ message: 'Winner ID is required' });
    }
    
    const knockout = await Knockout.findOne({ leagueId: req.params.leagueId });
    if (!knockout) {
      return res.status(404).json({ message: 'Knockout stage not found for this league' });
    }
    
    // Find the match to update
    let matchFound = false;
    let roundIndex = -1;
    let matchIndex = -1;
    
    for (let i = 0; i < knockout.rounds.length; i++) {
      for (let j = 0; j < knockout.rounds[i].matches.length; j++) {
        if (knockout.rounds[i].matches[j].id === req.params.matchId) {
          matchFound = true;
          roundIndex = i;
          matchIndex = j;
          break;
        }
      }
      if (matchFound) break;
    }
    
    if (!matchFound) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    // Update match result
    const match = knockout.rounds[roundIndex].matches[matchIndex];
    match.winner = winnerId;
    if (score1 !== undefined) match.score1 = score1;
    if (score2 !== undefined) match.score2 = score2;
    
    // Check if winner is valid
    if (winnerId !== match.competitor1.id && winnerId !== match.competitor2.id) {
      return res.status(400).json({ message: 'Invalid winner ID. Must be one of the competitors.' });
    }
    
    // Get winner data
    const winner = winnerId === match.competitor1.id ? match.competitor1 : match.competitor2;
    
    // If there's a next round, update the appropriate match with the winner
    if (roundIndex < knockout.rounds.length - 1) {
      const nextRoundIndex = roundIndex + 1;
      const nextMatchIndex = Math.floor(matchIndex / 2);
      
      // Determine if this winner should be competitor1 or competitor2 in the next match
      const isCompetitor1 = matchIndex % 2 === 0;
      
      if (isCompetitor1) {
        knockout.rounds[nextRoundIndex].matches[nextMatchIndex].competitor1 = winner;
      } else {
        knockout.rounds[nextRoundIndex].matches[nextMatchIndex].competitor2 = winner;
      }
    }
    
    // Check if current round is complete
    let roundComplete = true;
    for (const match of knockout.rounds[roundIndex].matches) {
      if (!match.winner) {
        roundComplete = false;
        break;
      }
    }
    
    // If round is complete and not the final round, advance to next round
    if (roundComplete && roundIndex < knockout.rounds.length - 1) {
      knockout.currentRound = roundIndex + 1;
    }
    
    await knockout.save();
    res.json(knockout);
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ message: 'Error updating match', error: error.message });
  }
});

// PATCH reset a round (for admin purposes)
router.patch('/:leagueId/reset/:roundIndex', async (req, res) => {
  try {
    const roundIndex = parseInt(req.params.roundIndex);
    
    const knockout = await Knockout.findOne({ leagueId: req.params.leagueId });
    if (!knockout) {
      return res.status(404).json({ message: 'Knockout stage not found for this league' });
    }
    
    if (roundIndex < 0 || roundIndex >= knockout.rounds.length) {
      return res.status(400).json({ message: 'Invalid round index' });
    }
    
    // Reset all matches in the specified round
    for (const match of knockout.rounds[roundIndex].matches) {
      match.winner = null;
      match.score1 = 0;
      match.score2 = 0;
    }
    
    // Reset all subsequent rounds
    for (let i = roundIndex + 1; i < knockout.rounds.length; i++) {
      for (const match of knockout.rounds[i].matches) {
        match.winner = null;
        match.score1 = 0;
        match.score2 = 0;
        
        // Reset competitors if needed (for semifinals and finals)
        if (i > 0) {
          // Keep placeholder data but mark as TBD
          match.competitor1 = {
            id: 'TBD',
            name: 'TBD',
            flag: ''
          };
          match.competitor2 = {
            id: 'TBD',
            name: 'TBD',
            flag: ''
          };
        }
      }
    }
    
    // Set current round to the reset round
    knockout.currentRound = roundIndex;
    
    await knockout.save();
    res.json(knockout);
  } catch (error) {
    console.error('Error resetting round:', error);
    res.status(500).json({ message: 'Error resetting round', error: error.message });
  }
});

module.exports = router; 