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
import ErrorNotification from "@/components/ErrorNotification";
import SuccessNotification from "@/components/SuccessNotification";

type View = "setup" | "game" | "scoreboard" | "results" | "rules";

export default function Home() {
  const [view, setView] = useState<View>("setup");
  const [game, setGame] = useState<Game | null>(null);
  const [hasIncompleteGame, setHasIncompleteGame] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isStartingGame, setIsStartingGame] = useState(false);

  // Load game from storage on mount
  useEffect(() => {
    const savedGame = loadGame();
    if (savedGame && !savedGame.isComplete) {
      setHasIncompleteGame(true);
      // Don't auto-load, let user choose to resume
    }
  }, []);

  const handleStartGame = (
    playerCount: PlayerCount,
    holeCount: HoleCount,
    playerNames: string[],
    handicaps: (number | undefined)[],
    pars: number[]
  ) => {
    setIsStartingGame(true);
    setHasIncompleteGame(false);
    
    // Small delay for visual feedback
    setTimeout(() => {
      try {
        const newGame = createGame(playerCount, holeCount, playerNames, handicaps, pars);
        setGame(newGame);
        saveGame(newGame);
        setView("game");
        setSuccessMessage("Game started!");
        setIsStartingGame(false);
      } catch (error) {
        setErrorMessage("Failed to start game. Please try again.");
        setIsStartingGame(false);
      }
    }, 300);
  };

  const handleResumeGame = () => {
    const savedGame = loadGame();
    if (savedGame && !savedGame.isComplete) {
      setGame(savedGame);
      setView("game");
      setHasIncompleteGame(false);
      setSuccessMessage("Game resumed!");
    }
  };

  const handleStartNewGame = () => {
    setHasIncompleteGame(false);
    setGame(null);
    setView("setup");
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
      setSuccessMessage("Hole updated successfully!");
    } catch (error) {
      console.error("Error editing hole:", error);
      setErrorMessage("Failed to edit hole. Please try again.");
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
      <>
        {errorMessage && (
          <ErrorNotification
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}
        {successMessage && (
          <SuccessNotification
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        )}
        <SetupScreen
          onStartGame={handleStartGame}
          onViewRules={() => setView("rules")}
          hasIncompleteGame={hasIncompleteGame}
          onResumeGame={handleResumeGame}
          onStartNewGame={handleStartNewGame}
          isStartingGame={isStartingGame}
        />
      </>
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
    <>
      {errorMessage && (
        <ErrorNotification
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
      {successMessage && (
        <SuccessNotification
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      <GameScreen
        game={game}
        onGameUpdate={handleGameUpdate}
        onUpdatePar={handleUpdatePar}
        onViewScoreboard={() => setView("scoreboard")}
        onBack={() => setView("setup")}
      />
    </>
  );
}
