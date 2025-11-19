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
    Array.from({ length: 4 }, () => "")
  );
  const [nameError, setNameError] = useState(false);

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
    // Clear error when user starts typing
    if (nameError) {
      setNameError(false);
    }
  };

  const handleStart = () => {
    const names = playerNames.slice(0, playerCount);
    // Check if at least one player name has been entered
    const hasAtLeastOneName = names.some((name) => name.trim().length > 0);
    
    if (!hasAtLeastOneName) {
      setNameError(true);
      return;
    }
    
    setNameError(false);
    onStartGame(playerCount, holeCount, names);
  };

  return (
    <div className="golf-course-bg flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-5">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="text-4xl">⛳</span>
            <h1 className="text-4xl font-bold text-[#2d5016] dark:text-green-300 drop-shadow-lg">
              NINES GOLF
            </h1>
            <span className="text-4xl">🏌️</span>
          </div>
          <p className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-200">
            Golf Wagering Game{" "}
            <span className="italic text-gray-600 dark:text-gray-300">by Vibey Craft</span>
          </p>
          
          {/* Competitive positioning badges */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-[#2d5016] shadow-md dark:bg-gray-800/90 dark:text-green-300">
              ✓ Works Offline
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-[#2d5016] shadow-md dark:bg-gray-800/90 dark:text-green-300">
              ✓ No Account Required
            </span>
          </div>
        </div>

        {/* Number of Players */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-5 shadow-xl dark:bg-gray-800/80">
          <label className="mb-3 flex items-center gap-2 text-base font-bold text-[#2d5016] dark:text-green-300">
            <span>👥</span>
            Number of Players
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setPlayerCount(3);
                setNameError(false);
              }}
              className={`relative flex min-h-[52px] items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-bold transition-all ${
                playerCount === 3
                  ? "border-[#2d5016] bg-gradient-to-br from-[#2d5016] to-[#3d6b1f] text-white shadow-lg dark:from-[#4a7c2a] dark:to-[#5a8c3a]"
                  : "border-gray-300 bg-white/90 text-gray-900 shadow-md hover:border-[#2d5016] hover:shadow-lg dark:border-gray-600 dark:bg-gray-700/90 dark:text-white dark:hover:border-green-400"
              }`}
            >
              3 Players
            </button>
            <button
              onClick={() => {
                setPlayerCount(4);
                setNameError(false);
              }}
              className={`relative flex min-h-[52px] items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-bold transition-all ${
                playerCount === 4
                  ? "border-[#2d5016] bg-gradient-to-br from-[#2d5016] to-[#3d6b1f] text-white shadow-lg dark:from-[#4a7c2a] dark:to-[#5a8c3a]"
                  : "border-gray-300 bg-white/90 text-gray-900 shadow-md hover:border-[#2d5016] hover:shadow-lg dark:border-gray-600 dark:bg-gray-700/90 dark:text-white dark:hover:border-green-400"
              }`}
            >
              4 Players
              {playerCount === 4 && (
                <span className="absolute -right-2 -top-2 text-sm">⭐</span>
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
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-5 shadow-xl dark:bg-gray-800/80">
          <label className="mb-3 flex items-center gap-2 text-base font-bold text-[#2d5016] dark:text-green-300">
            <span>✍️</span>
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
                className={`w-full rounded-xl border-2 px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d5016]/50 ${
                  nameError
                    ? "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                    : "border-gray-300 bg-white/90 dark:border-gray-600 dark:bg-gray-700/90"
                } text-gray-900 placeholder:text-gray-500 focus:border-[#2d5016] dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#4a7c2a]`}
              />
            ))}
          </div>
          {nameError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Please enter at least one player name to start the game
            </p>
          )}
        </div>

        {/* Number of Holes */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-5 shadow-xl dark:bg-gray-800/80">
          <label className="mb-3 flex items-center gap-2 text-base font-bold text-[#2d5016] dark:text-green-300">
            <span>🏌️‍♂️</span>
            Number of Holes
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setHoleCount(9)}
              className={`flex min-h-[52px] items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-bold transition-all ${
                holeCount === 9
                  ? "border-[#2d5016] bg-gradient-to-br from-[#2d5016] to-[#3d6b1f] text-white shadow-lg dark:from-[#4a7c2a] dark:to-[#5a8c3a]"
                  : "border-gray-300 bg-white/90 text-gray-900 shadow-md hover:border-[#2d5016] hover:shadow-lg dark:border-gray-600 dark:bg-gray-700/90 dark:text-white dark:hover:border-green-400"
              }`}
            >
              9 Holes
            </button>
            <button
              onClick={() => setHoleCount(18)}
              className={`flex min-h-[52px] items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-bold transition-all ${
                holeCount === 18
                  ? "border-[#2d5016] bg-gradient-to-br from-[#2d5016] to-[#3d6b1f] text-white shadow-lg dark:from-[#4a7c2a] dark:to-[#5a8c3a]"
                  : "border-gray-300 bg-white/90 text-gray-900 shadow-md hover:border-[#2d5016] hover:shadow-lg dark:border-gray-600 dark:bg-gray-700/90 dark:text-white dark:hover:border-green-400"
              }`}
            >
              18 Holes
            </button>
          </div>
        </div>

        {/* Start Game Button */}
        <button
          onClick={handleStart}
          className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#2d5016] to-[#3d6b1f] px-4 py-2.5 text-base font-bold text-white shadow-lg transition-all hover:from-[#3d6026] hover:to-[#4d7036] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#2d5016]/50 dark:from-[#4a7c2a] dark:to-[#5a8c3a] dark:hover:from-[#5a8c3a] dark:hover:to-[#6a9c4a]"
        >
          ⛳ START GAME ⛳
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

