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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Winner Celebration */}
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            GAME COMPLETE!
          </div>
          <div className="mx-auto inline-block rounded-lg border-4 border-yellow-400 bg-yellow-50 p-6 dark:bg-yellow-900/20">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">WINNER</div>
            <div className="mt-2 text-2xl font-bold text-[#2d5016] dark:text-[#4a7c2a]">
              {winner.name}
            </div>
            <div className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              {winner.totalPoints} POINTS
            </div>
          </div>
        </div>

        {/* Final Standings */}
        <div>
          <div className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
            Final Standings
          </div>
          <div className="space-y-2">
            {sortedPlayers.map((player, index) => {
              const medal =
                index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";
              return (
                <div
                  key={player.id}
                  className={`rounded-lg border-2 p-4 ${
                    index === 0
                      ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                      : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
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
            className="w-full rounded-lg bg-[#2d5016] px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-[#3d6026] focus:outline-none focus:ring-2 focus:ring-[#2d5016] focus:ring-offset-2 dark:bg-[#4a7c2a] dark:hover:bg-[#5a8c3a] dark:focus:ring-[#4a7c2a] dark:focus:ring-offset-gray-900"
          >
            Start New Game
          </button>
          <button
            onClick={handleShare}
            className="w-full rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Share Results
          </button>
        </div>
      </div>
    </div>
  );
}

