"use client";

import { useState } from "react";
import { Game } from "@/types/game";
import { getSortedPlayers, getLeader } from "@/lib/game-utils";
import { calculatePoints } from "@/lib/scoring";

interface ScoreboardScreenProps {
  game: Game;
  onBack: () => void;
  onReturnToGame: () => void;
  onEditHole?: (holeNumber: number, scores: number[]) => void;
}

export default function ScoreboardScreen({
  game,
  onBack,
  onReturnToGame,
  onEditHole,
}: ScoreboardScreenProps) {
  const sortedPlayers = getSortedPlayers(game.players);
  const leader = getLeader(game.players);
  const [editingHole, setEditingHole] = useState<number | null>(null);
  const [editScores, setEditScores] = useState<number[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  // Helper to get hole performance color
  const getHoleColorClass = (points: number, maxPoints: number) => {
    if (maxPoints === 0) return "poor";
    const percentage = points / maxPoints;
    if (percentage >= 0.75) return "good";
    if (percentage >= 0.4) return "average";
    return "poor";
  };

  // Helper to calculate average points per hole
  const getAveragePoints = (player: typeof sortedPlayers[0]) => {
    if (player.points.length === 0) return 0;
    return player.totalPoints / player.points.length;
  };

  // Get max points for normalization
  const getMaxPoints = (points: number[]) => {
    if (points.length === 0) return 5;
    return Math.max(...points, 5);
  };

  const handleEditHole = (holeNumber: number) => {
    if (!onEditHole) return;
    
    const holeIndex = holeNumber - 1;
    const currentScores = game.players.map((p) => p.scores[holeIndex] || 0);
    setEditScores(currentScores);
    setEditingHole(holeNumber);
  };

  const handleSaveEdit = () => {
    if (editingHole && onEditHole && editScores.every(s => s > 0 && s <= 20)) {
      onEditHole(editingHole, editScores);
      setEditingHole(null);
      setShowConfirm(false);
      setEditScores([]);
    }
  };

  const handleCancelEdit = () => {
    setEditingHole(null);
    setShowConfirm(false);
    setEditScores([]);
  };

  const handleConfirmEdit = () => {
    // Validate all scores are entered
    if (editScores.every(s => s > 0 && s <= 20)) {
      setShowConfirm(true);
    } else {
      alert("Please enter valid scores (1-20) for all players");
    }
  };

  return (
    <div className="golf-course-bg screen-enter flex min-h-screen flex-col px-4 py-4">
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
              <div className="mb-3 flex items-center justify-between">
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {medal} {player.name}
                  </span>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Avg: {getAveragePoints(player).toFixed(1)} pts/hole
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {player.totalPoints} pts
                </span>
              </div>
              
              {/* Mini Bar Chart */}
              {player.points.length > 0 && (
                <div className="mb-3">
                  <div className="mini-bar-chart">
                    {player.points.map((points, holeIndex) => {
                      const maxPoints = getMaxPoints(player.points);
                      const height = (points / maxPoints) * 100;
                      const colorClass = getHoleColorClass(points, maxPoints);
                      return (
                        <div
                          key={holeIndex}
                          className={`mini-bar ${colorClass}`}
                          style={{ height: `${Math.max(height, 5)}%` }}
                          title={`Hole ${holeIndex + 1}: ${points} pts`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Hole-by-hole breakdown with edit */}
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {player.points.map((points, holeIndex) => {
                  const holeNumber = holeIndex + 1;
                  const maxPoints = getMaxPoints(player.points);
                  const colorClass = getHoleColorClass(points, maxPoints);
                  const isEditable = holeNumber < game.currentHole && onEditHole;
                  const isBeingEdited = editingHole === holeNumber;
                  
                  return (
                    <button
                      key={holeIndex}
                      onClick={() => isEditable && !isBeingEdited && handleEditHole(holeNumber)}
                      disabled={!isEditable || isBeingEdited}
                      className={`rounded px-2 py-1 font-semibold transition-all ${
                        isBeingEdited
                          ? "ring-2 ring-blue-500"
                          : isEditable 
                          ? "cursor-pointer hover:scale-110 hover:shadow-md" 
                          : "cursor-default"
                      } ${
                        colorClass === "good"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : colorClass === "average"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                      title={isEditable ? `Edit Hole ${holeNumber}` : `Hole ${holeNumber}: ${points} pts`}
                    >
                      H{holeNumber}: {points}
                      {isBeingEdited && " ✏️"}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Hole Dialog */}
      {editingHole && !showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Edit Hole {editingHole}
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Update scores for all players. This will recalculate points for this hole.
            </p>
            <div className="mb-6 space-y-3">
              {game.players.map((player, index) => (
                <div key={player.id} className="flex items-center justify-between rounded-lg border-2 border-gray-200 p-3 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {player.name}
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={editScores[index] || ""}
                    onChange={(e) => {
                      const newScores = [...editScores];
                      newScores[index] = parseInt(e.target.value) || 0;
                      setEditScores(newScores);
                    }}
                    className="w-16 rounded-lg border-2 border-gray-300 px-3 py-2 text-center text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmEdit}
                className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98]"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 font-semibold text-gray-900 shadow-lg transition-all hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && editingHole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Confirm Edit
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Are you sure you want to edit Hole {editingHole}? This will recalculate all scores and points.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleSaveEdit}
                className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98]"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 font-semibold text-gray-900 shadow-lg transition-all hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto space-y-3">
        <button
          onClick={onReturnToGame}
          className="w-full rounded-xl bg-gradient-to-r from-[#2d5016] to-[#3d6b1f] px-6 py-4 text-lg font-bold text-white shadow-xl transition-all hover:from-[#3d6026] hover:to-[#4d7036] hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#2d5016]/50 dark:from-[#4a7c2a] dark:to-[#5a8c3a] dark:hover:from-[#5a8c3a] dark:hover:to-[#6a9c4a]"
        >
          ⛳ Return to Current Hole
        </button>
      </div>
    </div>
  );
}

