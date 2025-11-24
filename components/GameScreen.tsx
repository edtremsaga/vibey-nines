"use client";

import { useState, useEffect, useRef } from "react";
import { Game } from "@/types/game";
import { calculatePoints, getTieInfo } from "@/lib/scoring";
import { addHoleScores, getLeader } from "@/lib/game-utils";
import { calculateNetScore, calculateTotalNetScore } from "@/lib/handicap-utils";
import { saveGame } from "@/lib/storage";

interface GameScreenProps {
  game: Game;
  onGameUpdate: (game: Game) => void;
  onUpdatePar: (holeNumber: number, par: number) => void;
  onViewScoreboard: () => void;
  onBack: () => void;
}

export default function GameScreen({
  game,
  onGameUpdate,
  onUpdatePar,
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
  const [scoreErrors, setScoreErrors] = useState<boolean[]>(() =>
    Array(game.playerCount).fill(false)
  );
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [parInputValue, setParInputValue] = useState<string>(
    String(game.pars[game.currentHole - 1] || 4)
  );

  // Auto-focus first input when entering new hole
  useEffect(() => {
    // Reset focus when points are cleared (new hole)
    if (!points && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
    // Update par input value when hole changes
    setParInputValue(String(game.pars[game.currentHole - 1] || 4));
  }, [points, game.currentHole, game.pars]);

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
    // Allow empty string for editing
    if (value === "") {
      const newScores = [...scores];
      newScores[index] = 0;
      setScores(newScores);
      setPoints(null); // Reset points when scores change
      setTieInfo([]);
      // Clear error for this input
      const newErrors = [...scoreErrors];
      newErrors[index] = false;
      setScoreErrors(newErrors);
      return;
    }
    
    // Only allow numeric characters - remove any non-numeric characters
    const cleanedValue = value.replace(/[^0-9]/g, '');
    
    // If value was cleaned (had non-numeric chars), don't update with invalid chars
    if (cleanedValue !== value) {
      return;
    }
    
    const numValue = parseInt(cleanedValue);
    // Only allow values from 1 to 20
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
      const newScores = [...scores];
      newScores[index] = numValue;
      setScores(newScores);
      setPoints(null); // Reset points when scores change
      setTieInfo([]);
      // Clear error for this input
      const newErrors = [...scoreErrors];
      newErrors[index] = false;
      setScoreErrors(newErrors);
      
      // Auto-advance to next input if valid score entered
      if (index < game.playerCount - 1 && inputRefs.current[index + 1]) {
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 50);
      }
      
      // Auto-calculate if all scores are now entered
      const allScoresEntered = newScores.every((s) => s > 0);
      if (allScoresEntered) {
        // Small delay to allow user to see the last score entered
        setTimeout(() => {
          handleCalculate(newScores);
        }, 300);
      }
    } else {
      // Invalid input - show error
      const newErrors = [...scoreErrors];
      newErrors[index] = true;
      setScoreErrors(newErrors);
      // Clear error after 3 seconds
      setTimeout(() => {
        setScoreErrors((prev) => {
          const updated = [...prev];
          updated[index] = false;
          return updated;
        });
      }, 3000);
    }
  };

  const handleScoreKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Allow: backspace, delete, tab, escape, enter
    // Allow: Ctrl/Cmd + A, C, V, X (for copy/paste)
    // Allow: Arrow keys for navigation
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'Escape' ||
      e.key === 'Enter' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      (e.key === 'a' && (e.ctrlKey || e.metaKey)) ||
      (e.key === 'c' && (e.ctrlKey || e.metaKey)) ||
      (e.key === 'v' && (e.ctrlKey || e.metaKey)) ||
      (e.key === 'x' && (e.ctrlKey || e.metaKey))
    ) {
      return; // Allow these keys
    }
    
    // Block any non-numeric characters (only allow 0-9)
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // First check if it's a non-numeric character and block it
    handleScoreKeyDown(e, index);
    
    // Enter key to calculate if all scores entered
    if (e.key === "Enter" && hasScores) {
      handleCalculate();
    }
    // Arrow keys to navigate
    else if (e.key === "ArrowDown" && index < game.playerCount - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCalculate = (scoresToUse?: number[]) => {
    const scoresForCalc = scoresToUse || scores;
    // Validate all scores are entered
    if (scoresForCalc.some((s) => s === 0)) {
      return;
    }

    // Button press animation
    setButtonPressed(true);
    setTimeout(() => setButtonPressed(false), 200);

    const calculatedPoints = calculatePoints(scoresForCalc, game.playerCount);
    const tieData = getTieInfo(scoresForCalc, calculatedPoints);
    
    setPoints(calculatedPoints);
    setTieInfo(tieData);
    // Clear all errors when calculation succeeds
    setScoreErrors(Array(game.playerCount).fill(false));
    
    // Success animation
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 600);
  };

  const handleNextHole = () => {
    if (!points) return;

    // Button press animation
    setButtonPressed(true);
    setTimeout(() => setButtonPressed(false), 200);

    const updatedGame = addHoleScores(game, scores);
    saveGame(updatedGame);
    onGameUpdate(updatedGame);

    // Reset for next hole
    setScores(Array(game.playerCount).fill(0));
    setPoints(null);
    setTieInfo([]);
    setScoreErrors(Array(game.playerCount).fill(false));
    setShowSuccessAnimation(false);
  };

  const leader = getLeader(game.players);
  const currentHoleIndex = game.currentHole - 1;
  const hasScores = scores.every((s) => s > 0);
  const progressPercentage = ((game.currentHole - 1) / game.holeCount) * 100;

  return (
    <div className="golf-course-bg screen-enter flex min-h-screen flex-col px-4 py-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 font-semibold text-[#2d5016] shadow-md hover:bg-white/90 dark:bg-gray-800/80 dark:text-green-300 dark:hover:bg-gray-800/90"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3 rounded-xl bg-white/80 px-4 py-2 shadow-md dark:bg-gray-800/80">
          {isOffline && (
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">🔌 Offline</span>
          )}
          <span className="text-base font-bold text-[#2d5016] dark:text-green-300">
            ⛳ Hole {game.currentHole}/{game.holeCount}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
          <span>Progress</span>
          <span>{game.currentHole - 1} / {game.holeCount} holes</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Hole Info */}
      <div className="mb-6 text-center">
        <div className="mx-auto inline-block rounded-2xl border-4 border-[#2d5016] bg-gradient-to-br from-white/90 to-green-50/90 px-8 py-4 shadow-2xl dark:border-[#4a7c2a] dark:from-gray-800/90 dark:to-green-900/20">
          <div className="flex items-center justify-center gap-2 text-3xl font-bold text-[#2d5016] dark:text-green-300">
            <span>⛳</span>
            <span>HOLE {game.currentHole}</span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Par:</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={parInputValue}
              onChange={(e) => {
                const value = e.target.value;
                // Remove any non-numeric characters
                const cleanedValue = value.replace(/[^0-9]/g, '');
                
                // Allow empty, 3, 4, or 5
                if (cleanedValue === "" || cleanedValue === "3" || cleanedValue === "4" || cleanedValue === "5") {
                  setParInputValue(cleanedValue);
                  // If it's a valid digit, update the game state
                  if (cleanedValue !== "" && /^[345]$/.test(cleanedValue)) {
                    const parValue = parseInt(cleanedValue);
                    if (!isNaN(parValue)) {
                      onUpdatePar(game.currentHole, parValue);
                    }
                  }
                }
                // Otherwise, ignore the invalid input (don't update state)
              }}
              onKeyDown={(e) => {
                // Allow all normal editing keys and numbers
                if (
                  e.key === 'Backspace' ||
                  e.key === 'Delete' ||
                  e.key === 'Tab' ||
                  e.key === 'Enter' ||
                  e.key === 'ArrowLeft' ||
                  e.key === 'ArrowRight' ||
                  e.key === 'ArrowUp' ||
                  e.key === 'ArrowDown' ||
                  (e.key === 'a' && (e.ctrlKey || e.metaKey)) ||
                  (e.key === 'c' && (e.ctrlKey || e.metaKey)) ||
                  (e.key === 'v' && (e.ctrlKey || e.metaKey)) ||
                  (e.key === 'x' && (e.ctrlKey || e.metaKey)) ||
                  /^[0-9]$/.test(e.key)
                ) {
                  return; // Allow these keys
                }
                // Block other characters
                e.preventDefault();
              }}
              onBlur={(e) => {
                // Ensure valid value on blur - if empty or invalid, restore current par
                const value = parInputValue;
                if (value === "" || !/^[345]$/.test(value)) {
                  const currentPar = String(game.pars[game.currentHole - 1] || 4);
                  setParInputValue(currentPar);
                }
              }}
              className="w-14 rounded-lg border-2 border-[#2d5016]/30 bg-white/90 px-2 py-1 text-center text-sm font-bold text-[#2d5016] shadow-sm focus:border-[#2d5016] focus:outline-none focus:ring-2 focus:ring-[#2d5016]/50 dark:border-[#4a7c2a]/50 dark:bg-gray-700/90 dark:text-green-300 dark:focus:border-[#4a7c2a]"
            />
          </div>
        </div>
      </div>

      {/* Player Score Entry */}
      <div className="mb-4 space-y-2">
        {game.players.map((player, index) => {
          const playerPoints = points?.[index];
          const tie = tieInfo[index];
          
          return (
            <div
              key={player.id}
              className={`rounded-xl border-2 p-3 shadow-md backdrop-blur-sm transition-all ${
                points
                  ? playerPoints === Math.max(...(points || []))
                    ? "leader-glow border-yellow-400 bg-gradient-to-br from-yellow-50/90 to-amber-50/90 dark:from-yellow-900/30 dark:to-amber-900/20"
                    : "border-gray-300 bg-white/80 dark:border-gray-600 dark:bg-gray-800/80"
                  : leader?.id === player.id && player.totalPoints > 0
                    ? "border-yellow-300 bg-gradient-to-br from-yellow-50/70 to-amber-50/70 dark:from-yellow-900/20 dark:to-amber-900/10"
                    : "border-gray-300 bg-white/80 dark:border-gray-600 dark:bg-gray-800/80"
              } ${showSuccessAnimation && points && playerPoints === Math.max(...(points || [])) ? "success-animation" : ""}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">
                    {player.name}
                  </span>
                  {player.handicap !== undefined && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      HCP: {player.handicap}
                    </span>
                  )}
                </div>
                {points ? (
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-base font-bold text-gray-900 dark:text-white">
                      {tie?.isTied && "⚖️ "}
                      {playerPoints} {playerPoints === 1 ? "pt" : "pts"}
                    </span>
                    {player.handicap !== undefined && scores[index] > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Net: {calculateNetScore(scores[index], player.handicap, game.holeCount) ?? "—"}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Score:</span>
                    <div className="flex flex-col">
                      <input
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="number"
                        min="1"
                        max="20"
                        value={scores[index] || ""}
                        onChange={(e) => handleScoreChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        disabled={!!points}
                        className={`w-16 rounded-lg border-2 px-2 py-1 text-center text-base font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2d5016]/50 focus:ring-offset-1 ${
                          scoreErrors[index]
                            ? "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                            : "border-gray-300 bg-white/90 dark:border-gray-600 dark:bg-gray-700/90"
                        } text-gray-900 focus:border-[#2d5016] focus:scale-105 disabled:bg-gray-100 disabled:text-gray-500 dark:text-white dark:focus:border-[#4a7c2a] dark:disabled:bg-gray-800`}
                      />
                      {scoreErrors[index] && (
                        <span className="mt-0.5 text-[10px] text-red-600 dark:text-red-400">
                          Must be 1-20
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Pts: {playerPoints !== undefined ? playerPoints : "--"}
                    </span>
                  </div>
                )}
              </div>
              {points && tie?.isTied && (
                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Tied for {tie.tieType}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Calculate/Next Button */}
      {!points ? (
        <button
          onClick={handleCalculate}
          disabled={!hasScores}
          className={`mb-4 flex min-h-[52px] w-full flex-col items-center justify-center rounded-xl bg-gradient-to-r from-[#2d5016] to-[#3d6b1f] px-4 py-2.5 text-base font-bold text-white shadow-lg transition-all hover:from-[#3d6026] hover:to-[#4d7036] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:hover:scale-100 focus:outline-none focus:ring-4 focus:ring-[#2d5016]/50 dark:from-[#4a7c2a] dark:to-[#5a8c3a] dark:hover:from-[#5a8c3a] dark:hover:to-[#6a9c4a] dark:disabled:from-gray-600 dark:disabled:to-gray-700 ${buttonPressed ? "button-press" : ""}`}
        >
          🏌️ CALCULATE POINTS 🏌️
          <div className="mt-1 text-xs font-normal opacity-90">
            ⚡ Instant calculation • Press Enter
          </div>
        </button>
      ) : (
        <button
          onClick={handleNextHole}
          className={`mb-4 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-4 py-2.5 text-base font-bold text-white shadow-lg transition-all hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-green-600/50 ${buttonPressed ? "button-press" : ""}`}
        >
          {game.currentHole < game.holeCount ? "⛳ NEXT HOLE ⛳" : "🏆 VIEW RESULTS 🏆"}
        </button>
      )}

      {/* Running Totals */}
      <div className="mt-auto rounded-2xl border-2 border-gray-300 bg-white/80 backdrop-blur-sm p-5 shadow-xl dark:border-gray-600 dark:bg-gray-800/80">
        <div className="mb-3 flex items-center gap-2 text-base font-bold text-[#2d5016] dark:text-green-300">
          <span>📊</span>
          Running Totals
        </div>
        <div className="space-y-2">
          {game.players.map((player, index) => {
            const isLeader = leader?.id === player.id && player.totalPoints > 0;
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                  isLeader 
                    ? "leader-glow bg-gradient-to-r from-yellow-50/90 to-amber-50/90 font-bold text-yellow-700 dark:from-yellow-900/40 dark:to-amber-900/20 dark:text-yellow-300" 
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <span className="flex items-center gap-2">
                  {isLeader && <span className="text-lg">👑</span>}
                  <div className="flex flex-col">
                    <span>{player.name}</span>
                    {player.handicap !== undefined && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        HCP: {player.handicap}
                      </span>
                    )}
                  </div>
                </span>
                <div className="flex flex-col items-end">
                  <span className={`font-semibold ${isLeader ? "text-lg" : ""}`}>
                    {player.totalPoints} pts
                  </span>
                  {player.handicap !== undefined && player.scores.length > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Net: {calculateTotalNetScore(player.scores, player.handicap, game.holeCount) ?? "—"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={onViewScoreboard}
          className="mt-3 text-sm font-semibold text-[#2d5016] underline hover:text-[#3d6026] dark:text-[#4a7c2a] dark:hover:text-[#5a8c3a]"
        >
          📋 View Scoreboard →
        </button>
      </div>
    </div>
  );
}

