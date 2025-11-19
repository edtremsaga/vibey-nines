"use client";

import { Game } from "@/types/game";
import { getSortedPlayers } from "@/lib/game-utils";
import { clearGame } from "@/lib/storage";

interface ResultsScreenProps {
  game: Game;
  onNewGame: () => void;
}

export default function ResultsScreen({ game, onNewGame }: ResultsScreenProps) {
  const sortedPlayers = getSortedPlayers(game.players);
  const winner = sortedPlayers[0];

  const handleNewGame = () => {
    clearGame();
    onNewGame();
  };

  const handleShare = async () => {
    const text = `🏆 Nines Golf Results 🏆\n\nWinner: ${winner.name} - ${winner.totalPoints} points\n\nFinal Standings:\n${sortedPlayers
      .map((p, i) => {
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
        return `${medal} ${p.name}: ${p.totalPoints} pts`;
      })
      .join("\n")}`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(text);
      alert("Results copied to clipboard!");
    }
  };

  return (
    <div className="golf-course-bg flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Winner Celebration */}
        <div className="text-center">
          <div className="mb-6 text-3xl font-bold text-[#2d5016] dark:text-green-300 drop-shadow-lg">
            🎉 GAME COMPLETE! 🎉
          </div>
          <div className="mx-auto inline-block rounded-2xl border-4 border-yellow-400 bg-gradient-to-br from-yellow-50/95 to-amber-50/95 p-8 shadow-2xl dark:from-yellow-900/40 dark:to-amber-900/30">
            <div className="text-5xl mb-3">🏆</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">CHAMPION</div>
            <div className="mt-3 text-3xl font-bold text-[#2d5016] dark:text-[#4a7c2a]">
              {winner.name}
            </div>
            <div className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
              {winner.totalPoints} POINTS
            </div>
          </div>
        </div>

        {/* Final Standings */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-xl dark:bg-gray-800/80">
          <div className="mb-4 flex items-center gap-2 text-lg font-bold text-[#2d5016] dark:text-green-300">
            <span>📊</span>
            Final Standings
          </div>
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => {
              const medal =
                index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";
              return (
                <div
                  key={player.id}
                  className={`rounded-xl border-2 p-4 shadow-md backdrop-blur-sm ${
                    index === 0
                      ? "border-yellow-400 bg-gradient-to-br from-yellow-50/90 to-amber-50/90 dark:from-yellow-900/30 dark:to-amber-900/20"
                      : "border-gray-300 bg-white/70 dark:border-gray-600 dark:bg-gray-700/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {medal} {player.name}
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {player.totalPoints} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <button
            onClick={handleNewGame}
            className="w-full rounded-xl bg-gradient-to-r from-[#2d5016] to-[#3d6b1f] px-8 py-5 text-xl font-bold text-white shadow-2xl transition-all hover:from-[#3d6026] hover:to-[#4d7036] hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-[#2d5016]/50 dark:from-[#4a7c2a] dark:to-[#5a8c3a] dark:hover:from-[#5a8c3a] dark:hover:to-[#6a9c4a]"
          >
            ⛳ Start New Game
          </button>
          <button
            onClick={handleShare}
            className="w-full rounded-xl border-2 border-gray-300 bg-white/80 px-6 py-4 font-semibold text-gray-900 shadow-lg backdrop-blur-sm transition-all hover:bg-white/90 hover:shadow-xl dark:border-gray-600 dark:bg-gray-800/80 dark:text-white dark:hover:bg-gray-800/90"
          >
            📤 Share Results
          </button>
        </div>
      </div>
    </div>
  );
}

