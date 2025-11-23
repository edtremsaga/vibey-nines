/**
 * Calculate net score for a hole given gross score and handicap
 * Net score = Gross score - (handicap / 18) rounded
 * For 9-hole rounds, divide by 9 instead
 */
export function calculateNetScore(
  grossScore: number,
  handicap: number | undefined,
  holeCount: number
): number | null {
  if (handicap === undefined || handicap === null) {
    return null; // No handicap, no net score
  }

  // Calculate strokes per hole based on handicap and hole count
  const strokesPerHole = handicap / holeCount;
  
  // Round to nearest integer for net score
  const netScore = grossScore - Math.round(strokesPerHole);
  
  return netScore;
}

/**
 * Calculate total net score across all holes
 */
export function calculateTotalNetScore(
  grossScores: number[],
  handicap: number | undefined,
  holeCount: number
): number | null {
  if (handicap === undefined || handicap === null) {
    return null;
  }

  const totalGross = grossScores.reduce((sum, score) => sum + score, 0);
  const totalNet = totalGross - handicap;
  
  return totalNet;
}

