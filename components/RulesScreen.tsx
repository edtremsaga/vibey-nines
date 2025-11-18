"use client";

interface RulesScreenProps {
  onBack: () => void;
}

export default function RulesScreen({ onBack }: RulesScreenProps) {
  return (
    <div className="flex min-h-screen flex-col px-4 py-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          ← Back
        </button>
        <span className="text-base font-medium text-gray-900 dark:text-white">Rules</span>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How to Play Nines</h2>

        {/* Points System */}
        <div className="rounded-lg border-2 border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
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
        <div className="rounded-lg border-2 border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
          <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Tie Rules</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The app automatically handles all tie scenarios. Points are distributed
            so that exactly 9 points are awarded per hole using integer values.
          </p>
        </div>

        {/* Tips */}
        <div className="rounded-lg border-2 border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
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

