"use client";

import { Game } from "@/types/game";
import { getSortedPlayers, getLeader } from "@/lib/game-utils";

interface ScoreboardScreenProps {
  game: Game;
  onBack: () => void;
  onReturnToGame: () => void;
}

export default function ScoreboardScreen({
  game,
  onBack,
  onReturnToGame,
}: ScoreboardScreenProps) {
  const sortedPlayers = getSortedPlayers(game.players);
  const leader = getLeader(game.players);

  return (
    <div className="flex min-h-screen flex-col px-4 py-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          ← Game
        </button>
        <span className="text-base font-medium text-gray-900 dark:text-white">
          Scoreboard
        </span>
      </div>

      {/* Hole Progress */}
      <div className="mb-6 text-center">
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          Hole {game.currentHole} of {game.holeCount}
        </div>
      </div>

      {/* Player Standings */}
      <div className="mb-6 space-y-3">
        {sortedPlayers.map((player, index) => {
          const isLeader = leader?.id === player.id;
          const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";

          return (
            <div
              key={player.id}
              className={`rounded-lg border-2 p-4 ${
                isLeader
                  ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                  : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {medal} {player.name}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {player.totalPoints} pts
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                {player.points.map((points, holeIndex) => (
                  <span key={holeIndex}>
                    H{holeIndex + 1}: {points}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-3">
        <button
          onClick={onReturnToGame}
          className="w-full rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          Return to Current Hole
        </button>
      </div>
    </div>
  );
}

