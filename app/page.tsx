"use client";

import { useState, useEffect } from "react";
import { Game, GameState, PlayerCount, HoleCount } from "@/types/game";
import { createGame, editHoleScores } from "@/lib/game-utils";
import { loadGame, saveGame } from "@/lib/storage";
import SetupScreen from "@/components/SetupScreen";
import GameScreen from "@/components/GameScreen";
import ScoreboardScreen from "@/components/ScoreboardScreen";
import ResultsScreen from "@/components/ResultsScreen";
import RulesScreen from "@/components/RulesScreen";

type View = "setup" | "game" | "scoreboard" | "results" | "rules";

export default function Home() {
  const [view, setView] = useState<View>("setup");
  const [game, setGame] = useState<Game | null>(null);

  // Load game from storage on mount
  useEffect(() => {
    const savedGame = loadGame();
    if (savedGame && !savedGame.isComplete) {
      setGame(savedGame);
      setView("game");
    }
  }, []);

  const handleStartGame = (
    playerCount: PlayerCount,
    holeCount: HoleCount,
    playerNames: string[],
    handicaps: (number | undefined)[],
    pars: number[]
  ) => {
    const newGame = createGame(playerCount, holeCount, playerNames, handicaps, pars);
    setGame(newGame);
    saveGame(newGame);
    setView("game");
  };

  const handleGameUpdate = (updatedGame: Game) => {
    setGame(updatedGame);
    saveGame(updatedGame);
    if (updatedGame.isComplete) {
      setView("results");
    }
  };

  const handleEditHole = (holeNumber: number, scores: number[]) => {
    if (!game) return;
    try {
      const updatedGame = editHoleScores(game, holeNumber, scores);
      setGame(updatedGame);
      saveGame(updatedGame);
    } catch (error) {
      console.error("Error editing hole:", error);
      alert("Failed to edit hole. Please try again.");
    }
  };

  const handleUpdatePar = (holeNumber: number, par: number) => {
    if (!game) return;
    const updatedPars = [...game.pars];
    updatedPars[holeNumber - 1] = par;
    const updatedGame = { ...game, pars: updatedPars };
    setGame(updatedGame);
    saveGame(updatedGame);
  };

  const handleNewGame = () => {
    setGame(null);
    setView("setup");
  };

  // Render based on current view
  if (view === "rules") {
    return <RulesScreen onBack={() => setView("setup")} />;
  }

  if (view === "setup") {
    return (
      <SetupScreen
        onStartGame={handleStartGame}
        onViewRules={() => setView("rules")}
      />
    );
  }

  if (!game) {
    return (
      <SetupScreen
        onStartGame={handleStartGame}
        onViewRules={() => setView("rules")}
      />
    );
  }

  if (view === "results" || game.isComplete) {
    return <ResultsScreen game={game} onNewGame={handleNewGame} />;
  }

  if (view === "scoreboard") {
    return (
      <ScoreboardScreen
        game={game}
        onBack={() => setView("game")}
        onReturnToGame={() => setView("game")}
        onEditHole={handleEditHole}
      />
    );
  }

  return (
    <GameScreen
      game={game}
      onGameUpdate={handleGameUpdate}
      onUpdatePar={handleUpdatePar}
      onViewScoreboard={() => setView("scoreboard")}
      onBack={() => setView("setup")}
    />
  );
}
