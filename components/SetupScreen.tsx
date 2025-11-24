"use client";

import { useState, useRef, useEffect } from "react";
import { PlayerCount, HoleCount } from "@/types/game";
import { saveSettings, loadSettings } from "@/lib/storage";

interface SetupScreenProps {
  onStartGame: (
    playerCount: PlayerCount,
    holeCount: HoleCount,
    playerNames: string[],
    handicaps: (number | undefined)[],
    pars: number[]
  ) => void;
  onViewRules?: () => void;
}

export default function SetupScreen({ onStartGame, onViewRules }: SetupScreenProps) {
  // Load saved settings on mount
  const savedSettings = loadSettings();
  
  const [playerCount, setPlayerCount] = useState<PlayerCount>(
    savedSettings?.playerCount || 3
  );
  const [holeCount, setHoleCount] = useState<HoleCount>(
    savedSettings?.holeCount || 18
  );
  const [playerNames, setPlayerNames] = useState<string[]>(() => {
    if (savedSettings?.playerNames) {
      // Ensure array has 4 elements, filling with empty strings if needed
      const names = [...savedSettings.playerNames];
      while (names.length < 4) {
        names.push("");
      }
      return names.slice(0, 4);
    }
    return Array.from({ length: 4 }, () => "");
  });
  const [handicaps, setHandicaps] = useState<(number | undefined)[]>(() =>
    Array.from({ length: 4 }, () => undefined)
  );
  const [handicapInputValues, setHandicapInputValues] = useState<string[]>(() =>
    Array.from({ length: 4 }, () => "")
  );
  const [handicapErrors, setHandicapErrors] = useState<boolean[]>(() =>
    Array.from({ length: 4 }, () => false)
  );
  const [showHcpTooltip, setShowHcpTooltip] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const nameInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hcpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePlayerNameChange = (index: number, name: string) => {
    // Auto-capitalize first letter as user types
    let capitalizedName = name;
    if (name.length > 0) {
      // Capitalize first letter, keep rest as-is
      capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    }
    
    const newNames = [...playerNames];
    newNames[index] = capitalizedName;
    setPlayerNames(newNames);
  };

  const handlePlayerNameBlur = (index: number) => {
    // Capitalize first letter when user finishes editing
    const name = playerNames[index];
    if (name && name.length > 0 && name.trim().length > 0) {
      // Capitalize first letter, keep rest as-is
      const trimmed = name.trim();
      const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      if (capitalized !== trimmed) {
        const newNames = [...playerNames];
        newNames[index] = capitalized;
        setPlayerNames(newNames);
      }
    }
  };

  const handleHandicapChange = (index: number, value: string) => {
    const newHandicaps = [...handicaps];
    const newErrors = [...handicapErrors];
    const newInputValues = [...handicapInputValues];
    
    // Allow empty string (optional handicap)
    if (value === "") {
      newHandicaps[index] = undefined;
      newInputValues[index] = "";
      newErrors[index] = false;
      setHandicaps(newHandicaps);
      setHandicapInputValues(newInputValues);
      setHandicapErrors(newErrors);
      return;
    }
    
    // Only allow numeric characters, decimal point, and minus sign
    // Remove any non-numeric characters (except decimal and minus)
    let cleanedValue = value.replace(/[^0-9.-]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      cleanedValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Prevent minus sign in wrong position (must be at start)
    if (cleanedValue.includes('-') && cleanedValue.indexOf('-') !== 0) {
      cleanedValue = cleanedValue.replace(/-/g, '');
      if (cleanedValue && !cleanedValue.startsWith('-')) {
        cleanedValue = '-' + cleanedValue;
      }
    }
    
    // Update input value for display
    newInputValues[index] = cleanedValue;
    
    // Allow partial decimal values during typing (e.g., "5.", "12.", "-")
    const isValidPartial = cleanedValue === "-" || cleanedValue.endsWith('.');
    const numValue = parseFloat(cleanedValue);
    
    if (!isValidPartial && !isNaN(numValue)) {
      // Complete number - validate range
      if (numValue < -54 || numValue > 54) {
        newErrors[index] = true;
        setHandicapErrors(newErrors);
        setHandicapInputValues(newInputValues);
        return;
      }
      
      // Valid handicap - store as number
      newHandicaps[index] = numValue;
      newErrors[index] = false;
    } else if (cleanedValue === "-" || cleanedValue.endsWith('.')) {
      // Partial value - allow it temporarily, don't store as number
      newErrors[index] = false;
    } else if (cleanedValue !== "" && isNaN(numValue)) {
      // Invalid - reset to empty or keep showing error
      newErrors[index] = true;
    } else {
      newErrors[index] = false;
    }
    
    setHandicaps(newHandicaps);
    setHandicapInputValues(newInputValues);
    setHandicapErrors(newErrors);
    
    // Clear validation errors when user fixes the issue
    if (newErrors[index] === false && validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };


  const handleStart = () => {
    const names = playerNames.slice(0, playerCount);
    const playerHandicaps = handicaps.slice(0, playerCount);
    // Default all pars to 4 - users can set them per hole during gameplay
    const holePars = Array.from({ length: holeCount }, () => 4);
    
    // Use default names if not provided
    const finalNames = names.map((name, index) => 
      name.trim().length > 0 ? name.trim() : `Player ${index + 1}`
    );
    
    // Collect validation errors
    const errors: string[] = [];
    
    // Check if all handicaps are valid (if provided)
    const invalidHandicaps: number[] = [];
    playerHandicaps.forEach((hcp, index) => {
      if (hcp !== undefined && (hcp < -54 || hcp > 54)) {
        invalidHandicaps.push(index + 1);
      }
    });
    
    if (invalidHandicaps.length > 0) {
      errors.push(`Invalid handicap values for ${invalidHandicaps.length === 1 ? 'player' : 'players'} ${invalidHandicaps.join(', ')}. Must be between -54 and 54.`);
    }
    
    // Set validation errors
    setValidationErrors(errors);
    
    if (errors.length > 0) {
      // Scroll to top to show error summary
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Save settings for next time (save entered names, not defaults)
    saveSettings({
      playerCount,
      holeCount,
      playerNames: names, // Save the names as entered (empty strings if not entered)
    });
    
    onStartGame(playerCount, holeCount, finalNames, playerHandicaps, holePars);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      // Capitalize first letter before moving focus
      const name = playerNames[index];
      if (name && name.length > 0) {
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
        if (capitalized !== name) {
          const newNames = [...playerNames];
          newNames[index] = capitalized;
          setPlayerNames(newNames);
        }
      }
      // Both Enter and Tab go to current player's HCP field
      setTimeout(() => {
        hcpInputRefs.current[index]?.focus();
      }, 0);
    }
  };

  const handleHcpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Allow: backspace, delete, tab, escape, enter, decimal point, minus sign
    // Allow: Ctrl/Cmd + A, C, V, X (for copy/paste)
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Escape' ||
      e.key === '.' ||
      e.key === '-' ||
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
    
    if (e.key === 'Enter') {
      e.preventDefault();
      // Move to next HCP field, or next player's name field, or submit if last
      if (index < playerCount - 1) {
        hcpInputRefs.current[index + 1]?.focus();
      } else {
        // Last field, submit the form
        handleStart();
      }
      return;
    }
    
    if (e.key === 'Tab') {
      // Allow default Tab behavior for navigation
      return;
    }
    
    // Block any non-numeric characters
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="golf-course-bg screen-enter flex min-h-screen flex-col items-center px-4 py-4 overflow-y-auto" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))' }}>
      <div className="w-full max-w-md space-y-5 my-auto py-4">
        {/* Error Summary */}
        {validationErrors.length > 0 && (
          <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-600 p-4 shadow-lg">
            <div className="flex items-start gap-2">
              <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 dark:text-red-200 mb-2">Please fix the following errors:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-red-800 dark:text-red-300">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
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
            A Golf Wagering Game{" "}
            <span className="italic text-gray-600 dark:text-gray-300">by Vibey Craft</span>
          </p>
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
                setHandicapErrors(Array.from({ length: 4 }, () => false));
                setHandicapInputValues(Array.from({ length: 4 }, () => ""));
                setValidationErrors([]);
              }}
              className={`relative flex min-h-[52px] items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
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
                setHandicapErrors(Array.from({ length: 4 }, () => false));
                setHandicapInputValues(Array.from({ length: 4 }, () => ""));
                setValidationErrors([]);
              }}
              className={`relative flex min-h-[52px] items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                playerCount === 4
                  ? "border-[#2d5016] bg-gradient-to-br from-[#2d5016] to-[#3d6b1f] text-white shadow-lg dark:from-[#4a7c2a] dark:to-[#5a8c3a]"
                  : "border-gray-300 bg-white/90 text-gray-900 shadow-md hover:border-[#2d5016] hover:shadow-lg dark:border-gray-600 dark:bg-gray-700/90 dark:text-white dark:hover:border-green-400"
              }`}
            >
              4 Players
            </button>
          </div>
        </div>

        {/* Player Names */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-5 shadow-xl dark:bg-gray-800/80">
          <label className="mb-3 flex items-center gap-2 text-base font-bold text-[#2d5016] dark:text-green-300">
            <span>✍️</span>
            Player Names
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">(Optional)</span>
          </label>
          <div className="space-y-4">
            {Array.from({ length: playerCount }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-stretch gap-2 w-full">
                  <input
                    ref={(el) => {
                      nameInputRefs.current[index] = el;
                    }}
                    type="text"
                    value={playerNames[index]}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    onBlur={() => handlePlayerNameBlur(index)}
                    onKeyDown={(e) => handleNameKeyDown(e, index)}
                    placeholder={`Player ${index + 1}`}
                    autoComplete="name"
                    autoCapitalize="words"
                    className="flex-1 rounded-xl border-2 px-4 py-3 text-base leading-normal min-h-[48px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d5016]/50 border-gray-300 bg-white/90 dark:border-gray-600 dark:bg-gray-700/90 text-gray-900 placeholder:text-gray-500 focus:border-[#2d5016] dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#4a7c2a]"
                  />
                  <div className="relative flex-shrink-0">
                    <input
                      ref={(el) => {
                        hcpInputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="decimal"
                      value={handicapInputValues[index] || (handicaps[index] !== undefined ? String(handicaps[index]) : "")}
                      onChange={(e) => handleHandicapChange(index, e.target.value)}
                      onKeyDown={(e) => handleHcpKeyDown(e, index)}
                      onBlur={(e) => {
                        // On blur, if input is empty or invalid, clear it
                        const value = handicapInputValues[index];
                        if (value === "" || value === "-" || value === ".") {
                          const newInputValues = [...handicapInputValues];
                          newInputValues[index] = "";
                          setHandicapInputValues(newInputValues);
                          setHandicaps((prev) => {
                            const updated = [...prev];
                            updated[index] = undefined;
                            return updated;
                          });
                        }
                        setShowHcpTooltip(null);
                      }}
                      onFocus={() => setShowHcpTooltip(index)}
                      placeholder="HCP"
                      className={`w-[72px] rounded-xl border-2 px-2 py-3 text-base leading-normal min-h-[48px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d5016]/50 ${
                        handicapErrors[index]
                          ? "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                          : "border-gray-300 bg-white/90 dark:border-gray-600 dark:bg-gray-700/90"
                      } text-gray-900 placeholder:text-gray-500 focus:border-[#2d5016] dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#4a7c2a]`}
                    />
                    {showHcpTooltip === index && (
                      <div className="absolute left-0 top-full mt-2 z-50 w-64 max-w-[calc(100vw-2rem)] p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                        <p className="font-semibold mb-1">Handicap (Optional)</p>
                        <p>Enter a value between -54 and 54. Leave blank if not using handicaps.</p>
                        <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
                {handicapErrors[index] && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Handicap must be between -54 and 54
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Names default to "Player 1", "Player 2", etc. if left blank
          </p>
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
              className={`flex min-h-[52px] items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                holeCount === 9
                  ? "border-[#2d5016] bg-gradient-to-br from-[#2d5016] to-[#3d6b1f] text-white shadow-lg dark:from-[#4a7c2a] dark:to-[#5a8c3a]"
                  : "border-gray-300 bg-white/90 text-gray-900 shadow-md hover:border-[#2d5016] hover:shadow-lg dark:border-gray-600 dark:bg-gray-700/90 dark:text-white dark:hover:border-green-400"
              }`}
            >
              9 Holes
            </button>
            <button
              onClick={() => setHoleCount(18)}
              className={`flex min-h-[52px] items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleStart();
          }}
        >
          <button
            type="submit"
            className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#2d5016] to-[#3d6b1f] px-4 py-2.5 text-base font-bold text-white shadow-lg transition-all hover:from-[#3d6026] hover:to-[#4d7036] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#2d5016]/50 dark:from-[#4a7c2a] dark:to-[#5a8c3a] dark:hover:from-[#5a8c3a] dark:hover:to-[#6a9c4a]"
          >
            ⛳ START GAME ⛳
          </button>
        </form>

        {/* Help Link */}
        <div className="text-center pt-4 pb-2">
          <button 
            onClick={onViewRules}
            className="min-h-[44px] px-4 py-2 text-sm font-medium text-gray-700 underline hover:text-gray-900 dark:text-gray-300 dark:hover:text-white active:opacity-70"
          >
            Help / Rules
          </button>
        </div>
      </div>
    </div>
  );
}

