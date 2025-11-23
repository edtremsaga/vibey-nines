import { Game, Player, PlayerCount, HoleCount } from "@/types/game";

export function createGame(
  playerCount: PlayerCount,
  holeCount: HoleCount,
  playerNames: string[],
  handicaps: (number | undefined)[],
  pars: number[]
): Game {
  const players: Player[] = Array.from({ length: playerCount }, (_, i) => ({
    id: `player-${i + 1}`,
    name: playerNames[i] || `Player ${i + 1}`,
    handicap: handicaps[i],
    scores: [],
    points: [],
    totalPoints: 0,
  }));

  return {
    id: `game-${Date.now()}`,
    playerCount,
    holeCount,
    pars, // Store par values for each hole
    players,
    currentHole: 1,
    isComplete: false,
    createdAt: Date.now(),
  };
}

export function addHoleScores(
  game: Game,
  scores: number[]
): Game {
  if (game.isComplete) return game;

  // Validate scores
  if (scores.length !== game.playerCount) {
    throw new Error("Number of scores must match player count");
  }

  // Calculate points (import from scoring.ts)
  const { calculatePoints } = require("./scoring");
  const points = calculatePoints(scores, game.playerCount);

  // Update players
  const updatedPlayers = game.players.map((player, index) => {
    const newScores = [...player.scores, scores[index]];
    const newPoints = [...player.points, points[index]];
    const totalPoints = newPoints.reduce((sum, p) => sum + p, 0);

    return {
      ...player,
      scores: newScores,
      points: newPoints,
      totalPoints,
    };
  });

  const newCurrentHole = game.currentHole + 1;
  const isComplete = newCurrentHole > game.holeCount;

  return {
    ...game,
    players: updatedPlayers,
    currentHole: isComplete ? game.holeCount : newCurrentHole,
    isComplete,
  };
}

export function getLeader(players: Player[]): Player | null {
  if (players.length === 0) return null;

  return players.reduce((leader, player) => {
    if (player.totalPoints > leader.totalPoints) {
      return player;
    }
    return leader;
  }, players[0]);
}

export function getSortedPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.totalPoints - a.totalPoints);
}

export function editHoleScores(
  game: Game,
  holeNumber: number,
  newScores: number[]
): Game {
  if (game.isComplete) return game;
  if (holeNumber < 1 || holeNumber >= game.currentHole) return game;

  // Validate scores
  if (newScores.length !== game.playerCount) {
    throw new Error("Number of scores must match player count");
  }

  // Calculate points for the edited hole
  const { calculatePoints } = require("./scoring");
  const newPoints = calculatePoints(newScores, game.playerCount);

  const holeIndex = holeNumber - 1;

  // Update players - replace the hole's scores and recalculate totals
  const updatedPlayers = game.players.map((player, playerIndex) => {
    // Replace scores and points for this hole
    const updatedScores = [...player.scores];
    const updatedPoints = [...player.points];
    
    updatedScores[holeIndex] = newScores[playerIndex];
    updatedPoints[holeIndex] = newPoints[playerIndex];

    // Recalculate total points
    const totalPoints = updatedPoints.reduce((sum, p) => sum + p, 0);

    return {
      ...player,
      scores: updatedScores,
      points: updatedPoints,
      totalPoints,
    };
  });

  return {
    ...game,
    players: updatedPlayers,
  };
}

