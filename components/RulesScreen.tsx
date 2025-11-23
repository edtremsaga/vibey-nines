"use client";

interface RulesScreenProps {
  onBack: () => void;
}

export default function RulesScreen({ onBack }: RulesScreenProps) {
  return (
    <div className="golf-course-bg screen-enter flex min-h-screen flex-col px-4 py-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 font-semibold text-[#2d5016] shadow-md hover:bg-white/90 dark:bg-gray-800/80 dark:text-green-300 dark:hover:bg-gray-800/90"
        >
          ← Back
        </button>
        <span className="rounded-xl bg-white/80 px-4 py-2 text-base font-bold text-[#2d5016] shadow-md dark:bg-gray-800/80 dark:text-green-300">
          📖 Rules
        </span>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-md space-y-6">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-[#2d5016] dark:text-green-300">
          <span>⛳</span>
          <span>How to Play Nines</span>
        </h2>

        {/* Points System */}
        <div className="rounded-2xl border-2 border-gray-300 bg-white/80 backdrop-blur-sm p-6 shadow-xl dark:border-gray-600 dark:bg-gray-800/80">
          <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
            Points System (9 pts/hole)
          </h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">3-Player:</div>
              <ul className="ml-4 mt-1 list-disc space-y-1">
                <li>Low: 5 pts</li>
                <li>Middle: 3 pts</li>
                <li>High: 1 pt</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">4-Player:</div>
              <ul className="ml-4 mt-1 list-disc space-y-1">
                <li>Low: 4 pts</li>
                <li>2nd: 3 pts</li>
                <li>3rd: 2 pts</li>
                <li>High: 0 pts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tie Rules */}
        <div className="rounded-2xl border-2 border-gray-300 bg-white/80 backdrop-blur-sm p-6 shadow-xl dark:border-gray-600 dark:bg-gray-800/80">
          <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">⚖️ Tie Rules</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The app automatically handles all tie scenarios. Points are distributed
            so that exactly 9 points are awarded per hole using integer values.
          </p>
        </div>

        {/* Handicaps */}
        <div className="rounded-2xl border-2 border-gray-300 bg-white/80 backdrop-blur-sm p-6 shadow-xl dark:border-gray-600 dark:bg-gray-800/80">
          <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">🏌️ Handicaps & Net Scores</h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong className="text-gray-900 dark:text-white">Handicaps are optional</strong> and allow players of different skill levels to compete fairly.
            </p>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white mb-1">How Net Scores Work:</div>
              <ul className="ml-4 mt-1 list-disc space-y-1">
                <li>Net Score = Gross Score - (Handicap ÷ Number of Holes)</li>
                <li>Example: If your handicap is 18 and you play 18 holes, you subtract 1 stroke per hole</li>
                <li>Example: If your handicap is 9 and you play 18 holes, you subtract 0.5 strokes per hole (rounded)</li>
                <li>Total Net Score = Sum of all gross scores - full handicap</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white mb-1">Handicap Range:</div>
              <ul className="ml-4 mt-1 list-disc space-y-1">
                <li>Range: -54 to 54</li>
                <li>Negative handicaps are for skilled players (scratch or better)</li>
                <li>Positive handicaps represent strokes over par</li>
              </ul>
            </div>
            <p className="text-xs italic text-gray-500 dark:text-gray-500">
              Note: Nines points are calculated using gross scores. Net scores are shown for reference and handicap-adjusted comparisons.
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-2xl border-2 border-gray-300 bg-white/80 backdrop-blur-sm p-6 shadow-xl dark:border-gray-600 dark:bg-gray-800/80">
          <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Tips</h3>
          <ul className="ml-4 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>Every hole is worth 9 pts</li>
            <li>Fresh start each hole</li>
            <li>Perfect for betting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

