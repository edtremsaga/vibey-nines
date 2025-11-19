import { calculatePoints, getTieInfo } from "../scoring";

describe("calculatePoints - 3 Player Scenarios", () => {
  test("Standard scoring: Low (5), Middle (3), High (1)", () => {
    const scores = [4, 5, 6];
    const points = calculatePoints(scores, 3);
    
    expect(points).toEqual([5, 3, 1]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("Three-way tie: all get 3 points", () => {
    const scores = [4, 4, 4];
    const points = calculatePoints(scores, 3);
    
    expect(points).toEqual([3, 3, 3]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("Two-way tie for best: 4-4-1", () => {
    const scores = [4, 4, 5];
    const points = calculatePoints(scores, 3);
    
    expect(points).toEqual([4, 4, 1]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("Two-way tie for worst: 5-2-2", () => {
    const scores = [4, 5, 5];
    const points = calculatePoints(scores, 3);
    
    expect(points).toEqual([5, 2, 2]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("Standard with different order: scores [5, 4, 6]", () => {
    const scores = [5, 4, 6];
    const points = calculatePoints(scores, 3);
    
    // Player 1: 5 (middle) -> 3 pts
    // Player 2: 4 (best) -> 5 pts
    // Player 3: 6 (worst) -> 1 pt
    expect(points).toEqual([3, 5, 1]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("All points are integers", () => {
    const scores = [3, 4, 5];
    const points = calculatePoints(scores, 3);
    
    points.forEach((point) => {
      expect(Number.isInteger(point)).toBe(true);
    });
  });
});

describe("calculatePoints - 4 Player Scenarios", () => {
  test("Standard scoring: Low (4), 2nd (3), 3rd (2), High (0)", () => {
    const scores = [3, 4, 5, 6];
    const points = calculatePoints(scores, 4);
    
    expect(points).toEqual([4, 3, 2, 0]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("All four tie: 2-2-2-3", () => {
    const scores = [4, 4, 4, 4];
    const points = calculatePoints(scores, 4);
    
    expect(points).toEqual([2, 2, 2, 3]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("Three-way tie for best: 3-3-3-0", () => {
    const scores = [3, 3, 3, 5];
    const points = calculatePoints(scores, 4);
    
    expect(points).toEqual([3, 3, 3, 0]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("Three-way tie for worst: 4-2-2-1", () => {
    const scores = [3, 5, 5, 5];
    const points = calculatePoints(scores, 4);
    
    expect(points).toEqual([4, 2, 2, 1]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("Two-way tie for best: 3-3-2-1", () => {
    const scores = [4, 4, 5, 6];
    const points = calculatePoints(scores, 4);
    
    expect(points).toEqual([3, 3, 2, 1]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("Two-way tie for 2nd place: 4-3-2-0", () => {
    const scores = [3, 4, 4, 5];
    const points = calculatePoints(scores, 4);
    
    // Note: According to the code, when 2nd and 3rd tie, it's 4-3-2-0
    // But the PRD says "Two-way tie for 2nd: 4-3-2-0" which matches
    // Actually, checking the code more carefully - when second.score === third.score,
    // it gives 4-3-2-0, but that totals 9. Wait, 4+3+2+0 = 9, correct.
    // But the comment says "Last two tie for 2nd place" - let me check the logic
    expect(points).toEqual([4, 3, 2, 0]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("Two-way tie for worst: 4-3-1-1", () => {
    const scores = [3, 4, 5, 5];
    const points = calculatePoints(scores, 4);
    
    expect(points).toEqual([4, 3, 1, 1]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("Standard with different order: scores [5, 3, 6, 4]", () => {
    const scores = [5, 3, 6, 4];
    const points = calculatePoints(scores, 4);
    
    // Player 1: 5 (3rd) -> 2 pts
    // Player 2: 3 (best) -> 4 pts
    // Player 3: 6 (worst) -> 0 pts
    // Player 4: 4 (2nd) -> 3 pts
    expect(points).toEqual([2, 4, 0, 3]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("All points are integers", () => {
    const scores = [3, 4, 5, 6];
    const points = calculatePoints(scores, 4);
    
    points.forEach((point) => {
      expect(Number.isInteger(point)).toBe(true);
    });
  });
});

describe("calculatePoints - Edge Cases", () => {
  test("3-player: Very low scores", () => {
    const scores = [1, 2, 3];
    const points = calculatePoints(scores, 3);
    
    expect(points).toEqual([5, 3, 1]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("3-player: Very high scores", () => {
    const scores = [8, 10, 12];
    const points = calculatePoints(scores, 3);
    
    expect(points).toEqual([5, 3, 1]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("4-player: Very low scores", () => {
    const scores = [1, 2, 3, 4];
    const points = calculatePoints(scores, 4);
    
    expect(points).toEqual([4, 3, 2, 0]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });

  test("4-player: Very high scores", () => {
    const scores = [10, 12, 15, 18];
    const points = calculatePoints(scores, 4);
    
    expect(points).toEqual([4, 3, 2, 0]);
    expect(points.reduce((a, b) => a + b, 0)).toBe(9);
  });
});

describe("calculatePoints - Always Totals 9", () => {
  test("3-player: All scenarios total 9", () => {
    const scenarios = [
      [4, 5, 6], // Standard
      [4, 4, 4], // All tie
      [4, 4, 5], // Two-way tie best
      [4, 5, 5], // Two-way tie worst
      [3, 4, 5], // Different scores
      [1, 2, 3], // Low scores
      [8, 10, 12], // High scores
    ];

    scenarios.forEach((scores) => {
      const points = calculatePoints(scores, 3);
      const total = points.reduce((a, b) => a + b, 0);
      expect(total).toBe(9);
    });
  });

  test("4-player: All scenarios total 9", () => {
    const scenarios = [
      [3, 4, 5, 6], // Standard
      [4, 4, 4, 4], // All tie
      [3, 3, 3, 5], // Three-way tie best
      [3, 5, 5, 5], // Three-way tie worst
      [4, 4, 5, 6], // Two-way tie best
      [3, 4, 4, 5], // Two-way tie 2nd
      [3, 4, 5, 5], // Two-way tie worst
      [1, 2, 3, 4], // Low scores
      [10, 12, 15, 18], // High scores
    ];

    scenarios.forEach((scores) => {
      const points = calculatePoints(scores, 4);
      const total = points.reduce((a, b) => a + b, 0);
      expect(total).toBe(9);
    });
  });
});

describe("getTieInfo", () => {
  test("3-player: No ties", () => {
    const scores = [4, 5, 6];
    const points = [5, 3, 1];
    const tieInfo = getTieInfo(scores, points);

    expect(tieInfo).toEqual([
      { isTied: false },
      { isTied: false },
      { isTied: false },
    ]);
  });

  test("3-player: Two-way tie for best", () => {
    const scores = [4, 4, 5];
    const points = [4, 4, 1];
    const tieInfo = getTieInfo(scores, points);

    expect(tieInfo[0].isTied).toBe(true);
    expect(tieInfo[0].tieType).toBe("best");
    expect(tieInfo[1].isTied).toBe(true);
    expect(tieInfo[1].tieType).toBe("best");
    expect(tieInfo[2].isTied).toBe(false);
  });

  test("3-player: All three tie", () => {
    const scores = [4, 4, 4];
    const points = [3, 3, 3];
    const tieInfo = getTieInfo(scores, points);

    expect(tieInfo[0].isTied).toBe(true);
    expect(tieInfo[1].isTied).toBe(true);
    expect(tieInfo[2].isTied).toBe(true);
    // All should be "best" since they all have the best score
    expect(tieInfo[0].tieType).toBe("best");
  });

  test("4-player: Two-way tie for worst", () => {
    const scores = [3, 4, 5, 5];
    const points = [4, 3, 1, 1];
    const tieInfo = getTieInfo(scores, points);

    expect(tieInfo[0].isTied).toBe(false);
    expect(tieInfo[1].isTied).toBe(false);
    expect(tieInfo[2].isTied).toBe(true);
    expect(tieInfo[2].tieType).toBe("worst");
    expect(tieInfo[3].isTied).toBe(true);
    expect(tieInfo[3].tieType).toBe("worst");
  });
});

