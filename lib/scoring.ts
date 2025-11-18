import { PlayerCount } from "@/types/game";

/**
 * Calculate points for a hole based on scores
 * Returns array of points for each player (in order of scores array)
 */
export function calculatePoints(
  scores: number[],
  playerCount: PlayerCount
): number[] {
  // Create array of {score, index} pairs to track original positions
  const scorePairs = scores.map((score, index) => ({ score, index }));
  
  // Sort by score (lowest first = best)
  scorePairs.sort((a, b) => a.score - b.score);

  const points = new Array(playerCount).fill(0);

  if (playerCount === 3) {
    return calculate3PlayerPoints(scorePairs, points);
  } else {
    return calculate4PlayerPoints(scorePairs, points);
  }
}

function calculate3PlayerPoints(
  scorePairs: Array<{ score: number; index: number }>,
  points: number[]
): number[] {
  const [first, second, third] = scorePairs;

  // All three tie
  if (first.score === second.score && second.score === third.score) {
    points[first.index] = 3;
    points[second.index] = 3;
    points[third.index] = 3;
  }
  // First two tie for best
  else if (first.score === second.score) {
    points[first.index] = 4;
    points[second.index] = 4;
    points[third.index] = 1;
  }
  // Last two tie for worst
  else if (second.score === third.score) {
    points[first.index] = 5;
    points[second.index] = 2;
    points[third.index] = 2;
  }
  // No ties
  else {
    points[first.index] = 5; // Best
    points[second.index] = 3; // Middle
    points[third.index] = 1; // Worst
  }

  return points;
}

function calculate4PlayerPoints(
  scorePairs: Array<{ score: number; index: number }>,
  points: number[]
): number[] {
  const [first, second, third, fourth] = scorePairs;

  // All four tie
  if (
    first.score === second.score &&
    second.score === third.score &&
    third.score === fourth.score
  ) {
    points[first.index] = 2;
    points[second.index] = 2;
    points[third.index] = 2;
    points[fourth.index] = 3;
  }
  // Three-way tie for best
  else if (first.score === second.score && second.score === third.score) {
    points[first.index] = 3;
    points[second.index] = 3;
    points[third.index] = 3;
    points[fourth.index] = 0;
  }
  // Three-way tie for worst
  else if (second.score === third.score && third.score === fourth.score) {
    points[first.index] = 4;
    points[second.index] = 2;
    points[third.index] = 2;
    points[fourth.index] = 1;
  }
  // First two tie for best
  else if (first.score === second.score) {
    points[first.index] = 3;
    points[second.index] = 3;
    points[third.index] = 2;
    points[fourth.index] = 1;
  }
  // Last two tie for 2nd place
  else if (second.score === third.score) {
    points[first.index] = 4;
    points[second.index] = 3;
    points[third.index] = 2;
    points[fourth.index] = 0;
  }
  // Last two tie for worst
  else if (third.score === fourth.score) {
    points[first.index] = 4;
    points[second.index] = 3;
    points[third.index] = 1;
    points[fourth.index] = 1;
  }
  // No ties
  else {
    points[first.index] = 4; // Best
    points[second.index] = 3; // 2nd
    points[third.index] = 2; // 3rd
    points[fourth.index] = 0; // Worst
  }

  return points;
}

/**
 * Get tie information for display
 */
export function getTieInfo(
  scores: number[],
  points: number[]
): Array<{ isTied: boolean; tieType?: string }> {
  const tieInfo: Array<{ isTied: boolean; tieType?: string }> = [];
  
  // Group scores by value
  const scoreGroups: { [key: number]: number[] } = {};
  scores.forEach((score, index) => {
    if (!scoreGroups[score]) {
      scoreGroups[score] = [];
    }
    scoreGroups[score].push(index);
  });

  // Check for ties
  scores.forEach((score, index) => {
    const group = scoreGroups[score];
    if (group && group.length > 1) {
      const isBest = Math.min(...scores) === score;
      const isWorst = Math.max(...scores) === score;
      
      if (isBest) {
        tieInfo.push({ isTied: true, tieType: "best" });
      } else if (isWorst) {
        tieInfo.push({ isTied: true, tieType: "worst" });
      } else {
        tieInfo.push({ isTied: true, tieType: "middle" });
      }
    } else {
      tieInfo.push({ isTied: false });
    }
  });

  return tieInfo;
}

