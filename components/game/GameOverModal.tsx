/**
 * Game over modal component
 */

'use client';

interface GameOverModalProps {
  isWin: boolean;
  score: number;
  tilesCollected: number;
  snakeLength: number;
  onRestart: () => void;
  onNewGame: () => void;
}

/**
 * Modal displayed when game ends (win or loss)
 */
export function GameOverModal({
  isWin,
  score,
  tilesCollected,
  snakeLength,
  onRestart,
  onNewGame,
}: GameOverModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full border border-zinc-200">
        <div className="text-center">
          {/* Title */}
          <h2 className="text-3xl font-bold mb-2 text-zinc-900">
            {isWin ? '🎉 Victory!' : '💥 Game Over'}
          </h2>
          
          <p className="text-zinc-600 mb-6">
            {isWin
              ? 'You collected all the commits!'
              : 'Snake crashed! Better luck next time.'}
          </p>
          
          {/* Stats */}
          <div className="bg-zinc-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-zinc-900">
                  {score}
                </p>
                <p className="text-xs text-zinc-500">Final Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">
                  {tilesCollected}
                </p>
                <p className="text-xs text-zinc-500">Tiles</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">
                  {snakeLength}
                </p>
                <p className="text-xs text-zinc-500">Length</p>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onRestart}
              className="w-full px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={onNewGame}
              className="w-full px-6 py-3 bg-white text-zinc-900 border border-zinc-300 rounded-lg font-medium hover:bg-zinc-50 transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
