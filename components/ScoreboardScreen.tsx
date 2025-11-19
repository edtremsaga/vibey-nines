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
    <div className="golf-course-bg flex min-h-screen flex-col px-4 py-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 font-semibold text-[#2d5016] shadow-md hover:bg-white/90 dark:bg-gray-800/80 dark:text-green-300 dark:hover:bg-gray-800/90"
        >
          ← Game
        </button>
        <span className="rounded-xl bg-white/80 px-4 py-2 text-base font-bold text-[#2d5016] shadow-md dark:bg-gray-800/80 dark:text-green-300">
          📋 Scoreboard
        </span>
      </div>

      {/* Hole Progress */}
      <div className="mb-6 text-center">
        <div className="inline-block rounded-xl bg-white/80 px-6 py-3 text-lg font-bold text-[#2d5016] shadow-lg dark:bg-gray-800/80 dark:text-green-300">
          ⛳ Hole {game.currentHole} of {game.holeCount}
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
              className={`rounded-2xl border-2 p-5 shadow-lg backdrop-blur-sm ${
                isLeader
                  ? "border-yellow-400 bg-gradient-to-br from-yellow-50/90 to-amber-50/90 dark:from-yellow-900/30 dark:to-amber-900/20"
                  : "border-gray-300 bg-white/80 dark:border-gray-600 dark:bg-gray-800/80"
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
          className="w-full rounded-xl bg-gradient-to-r from-[#2d5016] to-[#3d6b1f] px-6 py-4 text-lg font-bold text-white shadow-xl transition-all hover:from-[#3d6026] hover:to-[#4d7036] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#2d5016]/50 dark:from-[#4a7c2a] dark:to-[#5a8c3a] dark:hover:from-[#5a8c3a] dark:hover:to-[#6a9c4a]"
        >
          ⛳ Return to Current Hole
        </button>
      </div>
    </div>
  );
}

