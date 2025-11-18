"use client";

import { useState, useEffect } from "react";
import { Game } from "@/types/game";
import { calculatePoints, getTieInfo } from "@/lib/scoring";
import { addHoleScores, getLeader } from "@/lib/game-utils";
import { saveGame } from "@/lib/storage";

interface GameScreenProps {
  game: Game;
  onGameUpdate: (game: Game) => void;
  onViewScoreboard: () => void;
  onBack: () => void;
}

export default function GameScreen({
  game,
  onGameUpdate,
  onViewScoreboard,
  onBack,
}: GameScreenProps) {
  const [scores, setScores] = useState<number[]>(() =>
    Array(game.playerCount).fill(0)
  );
  const [points, setPoints] = useState<number[] | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [tieInfo, setTieInfo] = useState<
    Array<{ isTied: boolean; tieType?: string }>
  >([]);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleScoreChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 20) {
      const newScores = [...scores];
      newScores[index] = numValue;
      setScores(newScores);
      setPoints(null); // Reset points when scores change
      setTieInfo([]);
    }
  };

  const handleCalculate = () => {
    // Validate all scores are entered
    if (scores.some((s) => s === 0)) {
      return;
    }

    const calculatedPoints = calculatePoints(scores, game.playerCount);
    const tieData = getTieInfo(scores, calculatedPoints);
    
    setPoints(calculatedPoints);
    setTieInfo(tieData);
  };

  const handleNextHole = () => {
    if (!points) return;

    const updatedGame = addHoleScores(game, scores);
    saveGame(updatedGame);
    onGameUpdate(updatedGame);

    // Reset for next hole
    setScores(Array(game.playerCount).fill(0));
    setPoints(null);
    setTieInfo([]);
  };

  const leader = getLeader(game.players);
  const currentHoleIndex = game.currentHole - 1;
  const hasScores = scores.every((s) => s > 0);

  return (
    <div className="flex min-h-screen flex-col px-4 py-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          {isOffline && (
            <span className="text-xs text-gray-600 dark:text-gray-400">🔌 Offline</span>
          )}
          <span className="text-base font-medium text-gray-900 dark:text-white">
            Hole {game.currentHole}/{game.holeCount}
          </span>
        </div>
      </div>

      {/* Hole Info */}
      <div className="mb-6 text-center">
        <div className="mx-auto inline-block rounded-lg border-2 border-[#2d5016] bg-[#2d5016]/10 px-6 py-3 dark:border-[#4a7c2a] dark:bg-[#4a7c2a]/20">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">HOLE {game.currentHole}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Par: 4</div>
        </div>
      </div>

      {/* Player Score Entry */}
      <div className="mb-6 space-y-4">
        {game.players.map((player, index) => {
          const playerPoints = points?.[index];
          const tie = tieInfo[index];
          
          return (
            <div
              key={player.id}
              className={`rounded-lg border-2 p-4 ${
                points
                  ? playerPoints === Math.max(...(points || []))
                    ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                    : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
                  : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {player.name}
                </span>
                {points && (
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {tie?.isTied && "⚖️ "}
                    {playerPoints} {playerPoints === 1 ? "point" : "points"}
                    {tie?.isTied && ` (tied for ${tie.tieType})`}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Score:</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={scores[index] || ""}
                  onChange={(e) => handleScoreChange(index, e.target.value)}
                  disabled={!!points}
                  className="w-20 rounded border-2 border-gray-300 bg-white px-3 py-2 text-center text-lg font-semibold text-gray-900 focus:border-[#2d5016] focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:border-[#4a7c2a] dark:disabled:bg-gray-800"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Points: {playerPoints !== undefined ? playerPoints : "--"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Calculate/Next Button */}
      {!points ? (
        <button
          onClick={handleCalculate}
          disabled={!hasScores}
          className="mb-4 w-full rounded-lg bg-[#2d5016] px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-[#3d6026] disabled:bg-gray-300 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d5016] focus:ring-offset-2 dark:bg-[#4a7c2a] dark:hover:bg-[#5a8c3a] dark:disabled:bg-gray-700 dark:focus:ring-[#4a7c2a] dark:focus:ring-offset-gray-900"
        >
          CALCULATE POINTS
          <div className="mt-1 text-sm font-normal opacity-90">
            ⚡ Instant calculation
          </div>
        </button>
      ) : (
        <button
          onClick={handleNextHole}
          className="mb-4 w-full rounded-lg bg-green-600 px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          {game.currentHole < game.holeCount ? "NEXT HOLE" : "VIEW RESULTS"}
        </button>
      )}

      {/* Running Totals */}
      <div className="mt-auto rounded-lg border-2 border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900">
        <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
          Running Totals
        </div>
        <div className="space-y-1">
          {game.players.map((player, index) => {
            const isLeader = leader?.id === player.id && player.totalPoints > 0;
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between text-sm ${
                  isLeader ? "font-semibold text-yellow-600 dark:text-yellow-400" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <span>
                  {isLeader && "🥇 "}
                  {player.name}: {player.totalPoints} pts
                </span>
              </div>
            );
          })}
        </div>
        <button
          onClick={onViewScoreboard}
          className="mt-3 text-xs text-[#2d5016] underline hover:text-[#3d6026] dark:text-[#4a7c2a] dark:hover:text-[#5a8c3a]"
        >
          View Scoreboard →
        </button>
      </div>
    </div>
  );
}

