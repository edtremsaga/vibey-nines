"use client";

import { useState } from "react";
import { PlayerCount, HoleCount } from "@/types/game";

interface SetupScreenProps {
  onStartGame: (
    playerCount: PlayerCount,
    holeCount: HoleCount,
    playerNames: string[]
  ) => void;
  onViewRules?: () => void;
}

export default function SetupScreen({ onStartGame, onViewRules }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState<PlayerCount>(3);
  const [holeCount, setHoleCount] = useState<HoleCount>(18);
  const [playerNames, setPlayerNames] = useState<string[]>(() =>
    Array.from({ length: 4 }, (_, i) => `Player ${i + 1}`)
  );

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    const names = playerNames.slice(0, playerCount);
    onStartGame(playerCount, holeCount, names);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">NINES GOLF</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Golf Betting Game</p>
          
          {/* Competitive positioning badges */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
              ✓ Works Offline
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
              ✓ No Account Required
            </span>
          </div>
        </div>

        {/* Number of Players */}
        <div>
          <label className="mb-3 block text-base font-medium text-gray-900 dark:text-white">
            Number of Players
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPlayerCount(3)}
              className={`flex min-h-[56px] items-center justify-center rounded-lg border-2 px-4 py-3 text-lg font-semibold transition-colors ${
                playerCount === 3
                  ? "border-[#2d5016] bg-[#2d5016] text-white dark:border-[#4a7c2a] dark:bg-[#4a7c2a]"
                  : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-500"
              }`}
            >
              3 Players
            </button>
            <button
              onClick={() => setPlayerCount(4)}
              className={`relative flex min-h-[56px] items-center justify-center rounded-lg border-2 px-4 py-3 text-lg font-semibold transition-colors ${
                playerCount === 4
                  ? "border-[#2d5016] bg-[#2d5016] text-white dark:border-[#4a7c2a] dark:bg-[#4a7c2a]"
                  : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-500"
              }`}
            >
              4 Players
              {playerCount === 4 && (
                <span className="absolute -right-2 -top-2 text-xs">⭐</span>
              )}
            </button>
          </div>
          {playerCount === 4 && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              ⭐ 4-player support
            </p>
          )}
        </div>

        {/* Player Names */}
        <div>
          <label className="mb-3 block text-base font-medium text-gray-900 dark:text-white">
            Player Names (Optional)
          </label>
          <div className="space-y-3">
            {Array.from({ length: playerCount }).map((_, index) => (
              <input
                key={index}
                type="text"
                value={playerNames[index]}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                placeholder={`Player ${index + 1}`}
                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 focus:border-[#2d5016] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#4a7c2a]"
              />
            ))}
          </div>
        </div>

        {/* Number of Holes */}
        <div>
          <label className="mb-3 block text-base font-medium text-gray-900 dark:text-white">
            Number of Holes
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setHoleCount(9)}
              className={`flex min-h-[56px] items-center justify-center rounded-lg border-2 px-4 py-3 text-lg font-semibold transition-colors ${
                holeCount === 9
                  ? "border-[#2d5016] bg-[#2d5016] text-white dark:border-[#4a7c2a] dark:bg-[#4a7c2a]"
                  : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-500"
              }`}
            >
              9
            </button>
            <button
              onClick={() => setHoleCount(18)}
              className={`flex min-h-[56px] items-center justify-center rounded-lg border-2 px-4 py-3 text-lg font-semibold transition-colors ${
                holeCount === 18
                  ? "border-[#2d5016] bg-[#2d5016] text-white dark:border-[#4a7c2a] dark:bg-[#4a7c2a]"
                  : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-500"
              }`}
            >
              18
            </button>
          </div>
        </div>

        {/* Start Game Button */}
        <button
          onClick={handleStart}
          className="w-full rounded-lg bg-[#2d5016] px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-[#3d6026] focus:outline-none focus:ring-2 focus:ring-[#2d5016] focus:ring-offset-2 dark:bg-[#4a7c2a] dark:hover:bg-[#5a8c3a] dark:focus:ring-[#4a7c2a] dark:focus:ring-offset-gray-900"
        >
          START GAME
        </button>

        {/* Help Link */}
        <div className="text-center">
          <button 
            onClick={onViewRules}
            className="text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Help / Rules
          </button>
        </div>
      </div>
    </div>
  );
}

